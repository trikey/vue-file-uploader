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
    }
  },

  mounted: function mounted() {
    var _this = this;

    if (this.$slots.default != null) {
      this.$slots.default[0].elm.addEventListener('click', function (event) {
        event.preventDefault();
        var input = document.getElementById(_this._uid);
        input.click();
      });
    }
  },
  data: function data() {
    return {
      progress: 0
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
      var formData = new FormData();

      (0, _from2.default)(files).forEach(function (file) {
        if (_this2.multiple) {
          formData.append('files[]', file, file.name);
        } else {
          formData.append('file', file, file.name);
        }
      });

      this.$http.post('/files/upload', formData, {
        progress: function progress(e) {
          _this2.progress = parseInt(e.loaded * 100 / e.total, 10);
        }
      }).then(function (response) {
        _this2.$emit('uploaded', response.data);
        _this2.clear();
      }).catch(function (e) {
        _this2.$emit('fail', e);
        _this2.clear();
      });
    },
    clear: function clear() {
      document.getElementById(this._uid).value = '';
    }
  }
};