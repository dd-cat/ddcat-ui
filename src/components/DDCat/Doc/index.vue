<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'DDCatDoc',
  data() {
    return {
      url: 'https://nextjs-docs-henna.vercel.app/'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
