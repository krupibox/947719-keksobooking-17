'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarDefault;
  var avatarInput = window.global.FORM.querySelector('#avatar');
  var avatarContainer = window.global.FORM.querySelector('.ad-form-header__preview');
  var avatarImage = window.global.FORM.querySelector('.ad-form-header__preview > img');

  var photoDefault;
  var photoInput = window.global.FORM.querySelector('#images');
  var photoBlock = window.global.FORM.querySelector('.ad-form__photo');
  var photoBlockClone;
  var photoContainer = window.global.FORM.querySelector('.ad-form__photo-container');
  var photoSource;

  var dropAreaTop = window.global.FORM.querySelector('.ad-form__field');
  var dropZoneTop = dropAreaTop.querySelector('.ad-form-header__drop-zone');
  var dropZoneTopStyle = dropZoneTop.style.border;

  var dropAreaBottom = window.global.FORM.querySelector('.ad-form__upload');
  var dropZoneBottom = dropAreaBottom.querySelector('.ad-form__drop-zone');
  var dropZoneBottomStyle = dropZoneBottom.style.border;

  var onDropAreaTopDragEnter = function (evt) {
    evt.preventDefault();
  };
  var onDropAreaBottomDragLeave = function (evt) {
    evt.preventDefault();
    dropZoneBottom.style.border = dropZoneBottomStyle;
  };
  var onDropAreaBottomDragOver = function (evt) {
    evt.preventDefault();
    dropZoneBottom.style.border = 'solid 1px #ff6d51';
  };
  var onDropAreaBottomDrop = function (evt) {
    evt.preventDefault();
    dropZoneBottom.style.border = dropZoneBottomStyle;
    onPhotoInputChange(evt.dataTransfer.files);
  };

  var onDropAreaTopDragLeave = function (evt) {
    evt.preventDefault();
    dropZoneTop.style.border = dropZoneTopStyle;
  };
  var onDropAreaTopDragOver = function (evt) {
    evt.preventDefault();
    dropZoneTop.style.border = 'solid 1px #ff6d51';
  };
  var onDropAreaTopDrop = function (evt) {
    evt.preventDefault();
    dropZoneTop.style.border = dropZoneTopStyle;
    onAvatarInputChange(evt.dataTransfer.files);
  };

  var resetFile = function () {
    if (avatarDefault) {
      avatarImage.remove();
      avatarContainer.style.padding = '0 15px';
      avatarContainer.appendChild(avatarDefault);
    }

    if (photoBlockClone) {
      var galleryChildren = photoContainer.querySelectorAll('.ad-form__photo');
      [].forEach.call(galleryChildren, function (element) {
        element.remove();
      });
      if (photoDefault) {
        photoContainer.appendChild(photoDefault);
        photoDefault = null;
      }
    }

    dropAreaTop.removeEventListener('dragenter', onDropAreaTopDragEnter);
    dropAreaTop.removeEventListener('dragleave', onDropAreaTopDragLeave);
    dropAreaTop.removeEventListener('dragover', onDropAreaTopDragOver);
    dropAreaTop.removeEventListener('drop', onDropAreaTopDrop);
    dropAreaBottom.removeEventListener('dragenter', onDropAreaTopDragEnter);
    dropAreaBottom.removeEventListener('dragleave', onDropAreaBottomDragLeave);
    dropAreaBottom.removeEventListener('dragover', onDropAreaBottomDragOver);
    dropAreaBottom.removeEventListener('drop', onDropAreaBottomDrop);
    avatarInput.removeEventListener('change', onAvatarInputChange);
    photoInput.removeEventListener('change', onPhotoInputChange);
  };

  var onImageDragStart = function (evt) {
    photoSource = evt.target;
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('src', photoSource.src);
  };
  var onImageDragOver = function (evt) {
    evt.preventDefault();
  };
  var onImageDrop = function (evt) {
    var photoTarget = evt.target;
    if (photoSource !== photoTarget) {
      photoSource.src = photoTarget.src;
      photoTarget.src = evt.dataTransfer.getData('src');
    }
  };

  var getAvatar = function (avatar) {
    var reader = new FileReader();
    var newAvatar = document.createElement('img');
    reader.addEventListener('load', function () {
      newAvatar.width = '70';
      newAvatar.height = '70';
      newAvatar.style.borderRadius = '5px';
      newAvatar.src = reader.result;
    });
    reader.readAsDataURL(avatar);

    return newAvatar;
  };

  var getFiles = function (photoFiles) {
    var files = Array.from(photoFiles);

    return files.filter(function (file) {
      return FILE_TYPES.some(function (it) {
        return file.name.toLowerCase().endsWith(it);
      });
    });
  };

  var getFilesData = function (data) {
    return (getFiles(data).length === 0) ? false : getFiles(data);
  };

  var onAvatarInputChange = function () {
    var match = getFilesData(avatarInput.files) || getFilesData(arguments[0]);
    avatarInput.value = null;
    if (match) {
      if (!avatarDefault) {
        avatarDefault = avatarContainer.removeChild(avatarImage);
      } else {
        avatarDefault.remove();
      }
      avatarContainer.style.padding = '0';
      avatarImage.remove();
      avatarImage = avatarContainer.appendChild(getAvatar(match[0]));
    }
  };

  var getPhoto = function (photo) {
    var reader = new FileReader();
    var newImage = document.createElement('img');
    reader.addEventListener('load', function () {
      newImage.src = reader.result;
      newImage.width = '70';
      newImage.height = '70';
      newImage.alt = 'Фотография жилья';
      newImage.draggable = true;
      newImage.style.borderRadius = '5px';
      newImage.addEventListener('dragstart', onImageDragStart);
      newImage.addEventListener('dragover', onImageDragOver);
      newImage.addEventListener('drop', onImageDrop);
    });
    reader.readAsDataURL(photo);

    return newImage;
  };

  var onPhotoInputChange = function () {
    var matches = getFilesData(photoInput.files) || getFilesData(arguments[0]);
    photoInput.value = null;
    var fragment = document.createDocumentFragment();
    if (matches) {
      if (!photoDefault) {
        photoDefault = photoContainer.removeChild(photoBlock);
      }
      matches.forEach(function (file) {
        photoBlockClone = photoBlock.cloneNode();
        photoBlockClone.appendChild(getPhoto(file));
        fragment.appendChild(photoBlockClone);
      });
    }
    photoContainer.appendChild(fragment);
  };

  var fileUploadHandlers = function () {
    dropAreaTop.addEventListener('dragenter', onDropAreaTopDragEnter);
    dropAreaTop.addEventListener('dragleave', onDropAreaTopDragLeave);
    dropAreaTop.addEventListener('dragover', onDropAreaTopDragOver);
    dropAreaTop.addEventListener('drop', onDropAreaTopDrop);

    dropAreaBottom.addEventListener('dragenter', onDropAreaTopDragEnter);
    dropAreaBottom.addEventListener('dragleave', onDropAreaBottomDragLeave);
    dropAreaBottom.addEventListener('dragover', onDropAreaBottomDragOver);
    dropAreaBottom.addEventListener('drop', onDropAreaBottomDrop);

    avatarInput.addEventListener('change', onAvatarInputChange);
    photoInput.addEventListener('change', onPhotoInputChange);
  };

  window.file = {
    activate: fileUploadHandlers,
    reset: resetFile
  };
})();
