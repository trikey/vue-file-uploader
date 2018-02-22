# vue-file-upload

This components makes file uploading easier.

# Installation

    npm install vue-file-uploader

# Usage

    import FileUploader from 'vue-file-uploader';

    // Register file uploader globally
    Vue.component('file-uploader', FileUploader);

    // Or use it locally where you need it
    components: {
        FileUploader
    },

    methods: {
        onFilesUploaded(files) {
        },

        onUploadFail(errors) {
        },
    }

    ...

    <file-uploader
        :only-images="true"
        mime-types="passed-to-accept-field-of-file-input"
        @uploaded="onFilesUploaded"
        @fail="onUploadFail"
        multiple
        button-text="Select me, then just upload me, satisfaction"
    ></file-uploader>

Component provides a way to customize its default look by using default slot.

Also you can customize progressbar. Use `progressbar` slot with scope param `progress`
to receive percentage of progress in your custom progressbar.

    // In vue < 2.5
    <file-uploader>
        <template slot="progressbar" scope="params">
            <div class="progressbar" :style="{ width: params.progress + '%' }"></div>
        </template>
    </file-uploader>

    // In vue 2.5+
    <file-uploader>
        <div slot="progressbar" scope="params" class="progressbar" :style="{ width: params.progress + '%' }"></div>
    </file-uploader>