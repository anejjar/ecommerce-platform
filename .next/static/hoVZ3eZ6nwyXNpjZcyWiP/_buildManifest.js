self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "has": [
          {
            "type": "query",
            "key": "o",
            "value": "(?<orgid>\\d*)"
          },
          {
            "type": "query",
            "key": "p",
            "value": "(?<projectid>\\d*)"
          },
          {
            "type": "query",
            "key": "r",
            "value": "(?<region>[a-z]{2})"
          }
        ],
        "source": "/monitoring(/?)"
      },
      {
        "has": [
          {
            "type": "query",
            "key": "o",
            "value": "(?<orgid>\\d*)"
          },
          {
            "type": "query",
            "key": "p",
            "value": "(?<projectid>\\d*)"
          }
        ],
        "source": "/monitoring(/?)"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c560c709-25bb-597d-b29a-227a047b0037")}catch(e){}}();
//# debugId=c560c709-25bb-597d-b29a-227a047b0037
