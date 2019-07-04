'use strict';

(function () {

  var Pin = {
    width: 50 / 2,
    height: 70,
    template: document.querySelector('#pin').content.querySelector('.map__pin'),
    container: document.querySelector('.map__pins')
  };

  var Error = {
    template: document.querySelector('#error').content.querySelector('.error'),
    container: document.querySelector('main')
  };

  var ESC = 27;

  var loadPin = function (object) {
    var clone = Pin.template.cloneNode(true);
    clone.style.left = (object.location.x) + 'px';
    clone.style.top = (object.location.y - Pin.height) + 'px';
    clone.children[0].src = object.author.avatar;
    clone.children[0].alt = object.offer.title;
    clone.setAttribute('id', object.offer.type);
    return clone;
  };

  var reducePins = function () {
    var mapPinsList = document.querySelectorAll('.map__pin');

    [].forEach.call(mapPinsList, function (element, index) {
      if (index > window.data.Pin.count) {
        element.style.visibility = 'hidden';
      }
    });
  };

  var renderPins = function (object) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < object.length; i++) {
      fragment.appendChild(loadPin(object[i]));
    }

    Pin.container.appendChild(fragment);
    reducePins();
  };

  var showError = function (message) {
    var errorMessage = Error.template.cloneNode(true);
    errorMessage.children[0].textContent = message;
    Error.container.appendChild(errorMessage);

    Error.container.addEventListener('mousedown', function () {
      errorMessage.remove();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC) {
        errorMessage.remove();
      }
    });
  };

  window.showPins = function () {
    window.load(renderPins, showError);
  };
})();
