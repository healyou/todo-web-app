<template>
  <div class="mb-3">
    <label class="form-label">Прикреплённые файлы</label>
    <div v-for="(file, index) in computedFileValues"
         v-bind:key="file.uuid"
         class="d-flex flex-row mb-1"
    >
      <div class="input-group">
        <input
            @input="handleInput($event, index)"
            :disabled="isDisabled"
            class="form-control"
            type="file"
        >
        <button v-if="isTwoOrMoreFileItem()" class="btn btn-outline-danger">remove</button>
        <button v-if="isLastFileItem(index)" class="btn btn-outline-success">add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "FilesDownloader",
  props: {
    modelValue: {
      default: []
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: this.value
    }
  },
  computed: {
    computedFileValues() {
      const computedFileValues = []
      for (let file of this.modelValue) {
        const computedFile = Object.assign(
            {}, file, { uuid: uuidv4() }
        )
        computedFileValues.push(computedFile)
      }
      return computedFileValues
    }
  },
  methods: {
    handleInput(event, index) {
      console.log(index)
      this.$emit('update:modelValue', this.modelValue)
    },
    isLastFileItem(index) {
      return this.modelValue.length - 1 === index
    },
    isTwoOrMoreFileItem() {
      return this.modelValue.length > 1
    }
  }
}
</script>