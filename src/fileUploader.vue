<template>
  <div :class="{ inline: !drop }">
    <slot>
      <label :for="_uid" class="btn btn-sky btn-icon full-width large btn-primary">
        {{ buttonText }}
      </label>
    </slot>
    <input
      :id="_uid"
      type="file"
      class="form-control"
      @change="upload($event.target.files)"
      style="display: none;"
      :accept="accept"
      :multiple="multiple"
    />
  <slot name="progressbar" :progress="progress">
    <div class="progress-holder" v-if="progress > 0 && progress !== 100">
      <div class="progress">
        <div
          class="progress-bar progress-bar-info progress-bar-striped"
          :style="{width: progress + '%'}"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  </slot>
  </div>
</template>
<script src="./fileUploader"></script>
<style>
  div.inline {
    display: inline-block;
  }

  .progress-holder {
    bottom: 5px;
    left: 5px;
    right: 5px;
    display: block;
  }

  .progress {
    height: 5px;
    margin: 0;
  }

  .dropzone {
    width: 100%;
    height: 200px;
    border: 3px dashed gray;
    padding: 20px;
    font-size: 28px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
