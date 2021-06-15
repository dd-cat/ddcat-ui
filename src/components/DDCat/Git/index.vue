<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'DDCatGit',
  data() {
    return {
      url: 'https://gitee.com/dd-cat/ddcat-ui.git'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
