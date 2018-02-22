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
  },

  mounted() {
    if (this.$slots.default != null) {
      this.$slots.default[0].elm.addEventListener('click', (event) => {
        event.preventDefault();
        const input = document.getElementById(this._uid);
        input.click();
      });
    }
  },

  data() {
    return {
      progress: 0,
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
        progress: (e) => {
          this.progress = parseInt((e.loaded * 100) / e.total, 10);
        },
      }).then((response) => {
        this.$emit('uploaded', response.data);
      }).catch((e) => {
        this.$emit('fail', e);
      });
    },
  },
};
