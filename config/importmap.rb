# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "chart.js", to: "https://ga.jspm.io/npm:chart.js@4.2.0/dist/chart.js"
pin "@kurkle/color", to: "https://ga.jspm.io/npm:@kurkle/color@0.3.2/dist/color.esm.js"
pin "chart.js/helpers", to: "https://ga.jspm.io/npm:chart.js@4.4.3/helpers/helpers.js"
pin "chartjs-plugin-datalabels", to: "https://ga.jspm.io/npm:chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.esm.js"
pin "marked" # @13.0.0
pin "typed.js" # @2.1.0
pin "flatpickr" # @4.6.13
