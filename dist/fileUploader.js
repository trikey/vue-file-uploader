'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    imagesOnly: {
      type: Boolean,
      default: false
    },
    mimeTypes: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Choose file'
    },
    buttonClass: null,
    drop: {
      type: Boolean,
      default: false
    }
  },

  mounted: function mounted() {
    var _this = this;

    if (this.$slots.default != null) {
      this.$slots.default[0].elm.addEventListener('click', function (event) {
        event.preventDefault();
        if (_this.canUpload) {
          var input = document.getElementById(_this._uid);
          input.click();
        }
      });

      if (this.drop) {
        this.$slots.default[0].elm.addEventListener('drop', function (event) {
          _this.dropFiles(event);
        });

        this.$slots.default[0].elm.addEventListener('dragover', function (event) {
          event.preventDefault();
        });
      }
    }
  },
  data: function data() {
    return {
      progress: 0,
      canUpload: true,
      currentRequest: null
    };
  },


  computed: {
    accept: function accept() {
      if (this.imagesOnly) {
        return 'image/*';
      }
      if (this.mimeTypes.length > 0) {
        return this.mimeTypes;
      }
      return '*';
    }
  },

  methods: {
    upload: function upload(files) {
      var _this2 = this;

      if (!files) {
        return;
      }

      this.canUpload = false;
      this.progress = 0;

      var formData = new FormData();

      (0, _from2.default)(files).forEach(function (file) {
        if (_this2.multiple) {
          formData.append('files[]', file, file.name);
        } else {
          formData.append('file', file, file.name);
        }
      });

      this.$http.post('/files/upload', formData, {
        showProgressBar: false,
        before: function before(request) {
          _this2.currentRequest = request;
        },
        progress: function progress(e) {
          _this2.progress = parseInt(e.loaded * 100 / e.total, 10);
        }
      }).then(function (response) {
        _this2.$emit('uploaded', response.data);
        _this2.clear();
      }).catch(function (e) {
        _this2.$emit('fail', e);
        _this2.clear();
      }).finally(function () {
        _this2.canUpload = true;
        _this2.currentRequest = null;
      });
    },
    clear: function clear() {
      document.getElementById(this._uid).value = '';
    },
    clearProgress: function clearProgress() {
      if (this.currentRequest != null) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
      this.progress = 0;
      this.canUpload = true;
    },
    dropFiles: function dropFiles(e) {
      var _this3 = this;

      var files = e.target.files || e.dataTransfer.files;
      var validFiles = (0, _from2.default)(files).filter(function (file) {
        var mimeTypeRegexp = new RegExp(_this3.accept.replace('*', '.\*'));
        return mimeTypeRegexp.test(file.type);
      });

      this.upload(validFiles);
    }
  }
};