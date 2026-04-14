const calculateLongDistanceEVRouteUrl = 'https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/';
const routingRequestTimeoutMs = 45000;

const requiredProperties = [ 'key', 'locations', 'chargingModes',
  'constantSpeedConsumptionInkWhPerHundredkm', 'currentChargeInkWh',
  'maxChargeInkWh', 'minChargeAtDestinationInkWh', 'minChargeAtChargingStopsInkWh' ];

function RouteData(obj) {
  for(const property in obj)
    this[property] = obj[property];

  if (!Array.isArray(this.routes) || this.routes.length === 0)
    throw new Error('Routing service returned no route data.');

  this.routes.forEach(function(route) {
    if (!Array.isArray(route.legs))
      return;

    route.legs.forEach(function(leg) {
      if (!Array.isArray(leg.points))
        return;

      const points = leg.points;
      const length = points.length;
      var index;

      for(index = 0; index < length; index++) {
        const point = points[index];
        points[index] = new tt.LngLat(point.longitude, point.latitude);
      }
    });
  });
}

RouteData.prototype.toGeoJson = function() {
  const geoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    ]
  };

  const coordinates = geoJson.features[0].geometry.coordinates;

  this.routes[0].legs.forEach(function(leg) {
    leg.points.forEach(function(point) {
      coordinates.push([point.lng, point.lat]);
    });
  });

  return geoJson;
}

function CalculateLongDistanceEVRouteOptions(options) {
  this.options = options;
}

CalculateLongDistanceEVRouteOptions.prototype.go = function() {
  const options = this.options;

  return new Promise(function(fulfill, reject) {
    if (!hasOwnProperties(options, requiredProperties)) {
      reject('calculateLongDistanceEVRoute call is missing required properties.');
      return;
    }

    const url = formatUrl(options, reject);
    if (url == null)
      return;

    const body = JSON.stringify({ chargingModes: options.chargingModes });

    const controller = new AbortController();
    const timeoutId = setTimeout(function() {
      controller.abort();
    }, routingRequestTimeoutMs);

    fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(function(response) {
      clearTimeout(timeoutId);
      return response.text().then(function(text) {
        let obj = null;
        if (text != null && text.trim() !== '') {
          try {
            obj = JSON.parse(text);
          } catch (e) {
            obj = null;
          }
        }

        if (!response.ok) {
          if (obj) {
            if (obj.error && obj.error.description) {
              reject(obj.error.description);
              return;
            }
            if (obj.detailedError && obj.detailedError.message) {
              reject(obj.detailedError.message);
              return;
            }
            if (obj.message) {
              reject(obj.message);
              return;
            }
          }

          if (text != null && text.trim() !== '') {
            reject(text.trim());
            return;
          }
          reject('Routing request failed (' + response.status + ' ' + response.statusText + ').');
          return;
        }

        if (obj == null) {
          reject('Routing service returned an unexpected response.');
          return;
        }

        if (obj.error) {
          reject(obj.error.description || 'Routing service returned an error.');
          return;
        }

        if (obj.detailedError && obj.detailedError.message) {
          reject(obj.detailedError.message);
          return;
        }

        if (!Array.isArray(obj.routes) || obj.routes.length === 0) {
          reject('No valid route returned by the routing service.');
          return;
        }

        try {
          fulfill(new RouteData(obj));
        } catch (error) {
          reject(error.message || 'Failed to parse route data.');
        }
      });
    })
    .catch(function(error) {
      clearTimeout(timeoutId);
      if (error && error.name === 'AbortError') {
        reject('Routing request timed out. Please try again.');
        return;
      }
      reject(error);
    });
  });

  function addLocations(url, locations) {
    if (locations == null)
      return false;

    var isFirstLocation = true;

    for(const location of locations) {
      if (!hasOwnProperties(location, ['lat', 'lng']))
        return false;

      if (isFirstLocation)
        isFirstLocation = false;
      else
        url.text += ':';

      url.text += location.lat + ',' + location.lng;
    }

    url.text += '/';
    return true;
  }

  function addParameter(url, options, name, defaultValue, format) {
    const hasProperty = options.hasOwnProperty(name);
    if (!hasProperty && defaultValue == null)
      return true;

    if (url.hasParameters)
      url.text += '&';
    else {
      url.text += '?';
      url.hasParameters = true;
    }

    var value = hasProperty ? options[name] : defaultValue;

    if (format != null) {
      value = format(value);
      if (value == null)
        return false;
    }

    url.text += name + '=' + encodeURIComponent(value);
    return true;
  }

  function addParameters(url, options, names) {
    names.forEach(function(name) {
      addParameter(url, options, name);
    });
  }

  function formatConsumptionPairs(pairs) {
    var text = '';

    for(const pair of pairs) {
      if (!Array.isArray(pair) || pair.length != 2)
        return null;

      if (text != '')
        text += ':';

      text += pair;
    }

    return text;
  }

  function formatUrl(options, reject) {
    hasOwnProperties(options, ['key', 'locations', 'chargingModes']);

    var url = { hasParameters: false, text: calculateLongDistanceEVRouteUrl };

    if (!addLocations(url, options.locations)) {
      reject(invalidProperty('locations'));
      return null;
    }

    url.text += '/json';

    addParameter(url, options, 'vehicleEngineType', 'electric');
    if (!addParameter(url, options, 'constantSpeedConsumptionInkWhPerHundredkm',
      null, formatConsumptionPairs)) {
      reject(invalidProperty('constantSpeedConsumptionInkWhPerHundredkm'));
      return null;
    }

    addParameters(url, options, [ 'currentChargeInkWh', 'maxChargeInkWh',
      'minChargeAtDestinationInkWh', 'minChargeAtChargingStopsInkWh',
      'vehicleHeading', 'sectionType', 'report', 'departAt', 'traffic', 'avoid',
      'vehicleMaxSpeed', 'vehicleWeight', 'vehicleAxleWeight', 'vehicleLength',
      'vehicleWidth', 'vehicleHeight', 'vehicleCommercial', 'vehicleLoadType',
      'accelerationEfficiency', 'decelerationEfficiency', 'uphillEfficiency',
      'downhillEfficiency', 'auxiliaryPowerInkW', 'key' ]);

    return url.text;
  }

  function hasOwnProperties(options, properties) {
    if (options == null)
      return false;

    for(const property of properties)
      if (!options.hasOwnProperty(property))
        return false;

    return true;
  }

  function invalidProperty(name) {
    return 'calculateLongDistanceEVRoute property (' + name + ') is invalid.';
  }
}

function calculateLongDistanceEVRoute(options) {
  return new CalculateLongDistanceEVRouteOptions(options);
}