import {
  Vue
} from './lib'

let gConfig = {}

function setConfig(config) {
  gConfig = config
}

function debugLog(string) {
  if (gConfig['DEBUG']) {
    console && console.log(new Date().toISOString() + ' ' + string)
  }
}

// Vue AJAX log 需要执行完Vue.use(VueResource)后才能初始化
function initVueAjaxLog() {
  Vue.http.interceptors.push(function (request, next) {
    debugLog(`[begin ajax] url: ${request.url}  request: ${JSON.stringify(request.body)}`)
    next(function (response) {
      debugLog(`[end ajax] url: ${response.url}  request: ${request.body} ` + (response.status !== 200 ? `http status: ${response.status}` : `response: ${JSON.stringify(response.body)} `))
    });
  })
}

// VUE component log
Vue.mixin({
  created() {
    var computed = this.$options.computed
    if (!computed) {
      return
    }
    var states = Object.keys(computed)
    var currentComponentName = this.$options._ubase_component_name

    if (currentComponentName && states.length > 0) {
      var statesStringArray = []

      _.each(states, (item) => {
        statesStringArray.push(`${item}: ${JSON.stringify(computed[item].bind(this)())}`)
      })

      debugLog(`[Vue Component Create] name: ${currentComponentName} state: \n-------------------------------------------------${statesStringArray.join('\n')}\n-------------------------------------------------`)
    }
  },

  beforeDestroy() {
    if (!this.$options.computed) {
      return
    }
    var states = Object.keys(this.$options.computed)
    var currentComponentName = this.$options._ubase_component_name

    if (currentComponentName && states.length > 0) {
      debugLog(`[Vue Component Destroy] name: ${currentComponentName}`)
    }
  }
})

function initLog() {
  initVueAjaxLog()
}

export {debugLog, setConfig, initLog}