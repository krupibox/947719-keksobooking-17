'use strict';

(function () {

  var template = document.querySelector('#card').content.querySelector('.map__card');
  var container = document.querySelector('.map');
  var block = container.querySelector('.map__filters-container');

  var classList = {
    avatar: '.popup__avatar',
    title: '.popup__title',
    address: '.popup__text--address',
    price: '.popup__text--price',
    type: '.popup__type',
    capacity: '.popup__text--capacity',
    time: '.popup__text--time',
    features: '.popup__features',
    description: '.popup__description',
    photos: '.popup__photos'
  };

  var typeProperty = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var numDecline = function (number, nominative, genitiveSingular, genitivePlural) {
    number %= 100;

    if (number > 14) {
      number %= 10;
    }

    switch (true) {
      case number === 1:
        return nominative;
      case number >= 2 && number <= 4:
        return genitiveSingular;
      case number >= 10 && number <= 14:
        return genitivePlural;
      default:
        return genitivePlural;
    }
  };

  var loadCard = function (object) {
    var clone = template.cloneNode(true);
    var cardFeatures = clone.querySelector(classList.features);
    var cardPhotos = clone.querySelector(classList.photos);

    clone.querySelector(classList.avatar).src = object.author.avatar;
    clone.querySelector(classList.title).textContent = object.offer.title;
    clone.querySelector(classList.address).textContent = object.offer.adress;
    clone.querySelector(classList.price).textContent = object.offer.price + '₽/ночь';
    clone.querySelector(classList.type).textContent = typeProperty[object.offer.type];
    clone.querySelector(classList.capacity).textContent = object.offer.rooms + ' ' + numDecline(object.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + object.offer.guests + ' ' + numDecline(object.offer.guests, 'гость', 'гостя', 'гостей');
    clone.querySelector(classList.time).textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    clone.querySelector(classList.description).textContent = object.offer.description;

    object.offer.features.forEach(function (element) {
      var newLi = document.createElement('li');
      newLi.className = 'popup__feature popup__feature--' + element;
      cardFeatures.appendChild(newLi);
    });

    object.offer.photos.forEach(function (element) {
      var newImg = document.createElement('img');
      Object.assign(newImg, {
        src: element,
        className: 'popup__photo',
        width: '45',
        height: '40',
        alt: 'Фотография жилья'
      });

      cardPhotos.appendChild(newImg);
    });

    return clone;
  };

  window.renderCards = function (object) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(loadCard(object[0]));
    container.insertBefore(fragment, block);
  };

})();
