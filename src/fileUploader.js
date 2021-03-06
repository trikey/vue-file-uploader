export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    imagesOnly: {
      type: Boolean,
      default: false,
    },
    mimeTypes: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Choose file',
    },
    buttonClass: null,
    drop: {
      type: Boolean,
      default: false,
    }
  },

  mounted() {
    if (this.$slots.default != null) {
      this.$slots.default[0].elm.addEventListener('click', (event) => {
        event.preventDefault();
        if (this.canUpload) {
          const input = document.getElementById(this._uid);
          input.click();
        }
      });

      if (this.drop) {
        this.$slots.default[0].elm.addEventListener('drop', (event) => {
          this.dropFiles(event);
        });

        this.$slots.default[0].elm.addEventListener('dragover', (event) => {
          event.preventDefault();
        });
      }
    }
  },

  data() {
    return {
      progress: 0,
      canUpload: true,
      currentRequest: null,
    };
  },

  computed: {
    accept() {
      if (this.imagesOnly) {
        return 'image/*';
      }
      if (this.mimeTypes.length > 0) {
        return this.mimeTypes;
      }
      return '*';
    },
  },

  methods: {
    upload(files) {
      if (!files) {
        return;
      }

      this.canUpload = false;
      this.progress = 0;

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        if (this.multiple) {
          formData.append('files[]', file, file.name);
        }
        else {
          formData.append('file', file, file.name);
        }
      });

      this.$http.post('/files/upload', formData, {
        showProgressBar: false,
        before: (request) => {
          this.currentRequest = request;
        },
        progress: (e) => {
          this.progress = parseInt((e.loaded * 100) / e.total, 10);
        },
      }).then((response) => {
        this.$emit('uploaded', response.data);
        this.clear();
      }).catch((e) => {
        this.$emit('fail', e);
        this.clear();
      }).finally(() => {
        this.canUpload = true;
        this.currentRequest = null;
      });
    },
    clear() {
      document.getElementById(this._uid).value = '';
    },
    clearProgress() {
      if (this.currentRequest != null) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
      this.progress = 0;
      this.canUpload = true;
    },
    dropFiles(e) {
      const files = e.target.files || e.dataTransfer.files;
      const validFiles = Array.from(files).filter((file) => {
        const mimeTypeRegexp = new RegExp(this.accept.replace('*', '.\*' ));
        return mimeTypeRegexp.test(file.type);
      });

      this.upload(validFiles);
    },
  },
};
