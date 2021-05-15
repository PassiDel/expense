<template>
  <div id="app" class="container">
    <b-row class="results">
      <b-col>
        <b-card title="Analysis" no-body>
          <b-card-header header-text-variant="white" class="container-fluid">
            <b-row style="display: table">
              <b-col md="8" lg="10" style="display: table-cell; vertical-align: middle">Result</b-col>
              <b-col md="2" class="float-right align-self-center" style="display: inline-table">
                <b-button-group size="sm">
                  <b-button v-b-modal.modalImport variant="info"><b-icon-upload /> Import</b-button>
                  <b-button id="exportButton" @click="exportData" variant="success"><b-icon-download /> Export</b-button>
                  <b-tooltip ref="exportTooltip" target="exportButton" disabled>Copied to clipboard!</b-tooltip>
                  <b-button @click="askReset" variant="danger"><b-icon-trash /> Reset</b-button>
                </b-button-group>
              </b-col>
            </b-row>
          </b-card-header>
          <b-card-body>
            <b-row v-if="calculated.in.data.length + calculated.out.data.length > 1">
              <b-col md="6"
                     v-for="key in ['in', 'out']"
                     :key="key">
                <b-card
                  :header="calculated[key].title"
                  bg-variant="secondary">
                  <graph-pie
                    :width="NaN"
                    :height="400"
                    :padding-top="100"
                    :padding-bottom="100"
                    :padding-left="100"
                    :padding-right="100"
                    :names="calculated[key].labels"
                    :values="calculated[key].data"
                    :show-text-type="'outside'"
                    :active-event="'click'"
                    :data-format="dataFormat"
                    :styles="pieStyle">
                    <legends :names="calculated[key].labels"></legends>
                    <tooltip :names="calculated[key].labels"></tooltip></graph-pie>
                </b-card>
              </b-col>
            </b-row>
            <b-row v-if="calculated.inTag.data.length + calculated.outTag.data.length > 1">
              <b-col md="6"
                     v-for="key in ['inTag', 'outTag']"
                     :key="key">

                <b-card
                  :header="calculated[key].title"
                  bg-variant="secondary">
                  <graph-pie
                    :width="NaN"
                    :height="400"
                    :padding-top="100"
                    :padding-bottom="100"
                    :padding-left="100"
                    :padding-right="100"
                    :names="calculated[key].labels"
                    :values="calculated[key].data"
                    :show-text-type="'outside'"
                    :active-event="'click'"
                    :data-format="dataFormat"
                    :styles="pieStyle">
                    <legends :names="calculated[key].labels"></legends>
                    <tooltip :names="calculated[key].labels"></tooltip></graph-pie>
                </b-card>
              </b-col>
            </b-row>
            <b-card-group class="text-center">
              <b-card header="Yearly">
                <p>Income: {{ calculated.yearly.in | currency }}</p>
                <p>Expenses: {{ calculated.yearly.out | currency }}</p>
                <p>Profit: <span :class="calculated.yearly.sum < 0 ? 'text-danger' : 'text-success'">{{ calculated.yearly.sum | currency }}</span></p>
              </b-card>
              <b-card header="Monthly">
                <p>Income: {{ calculated.yearly.in/12 | currency }}</p>
                <p>Expenses: {{ calculated.yearly.out/12 | currency }}</p>
                <p>Profit: <span :class="calculated.yearly.sum/12 < 0 ? 'text-danger' : 'text-success'">{{ calculated.yearly.sum/12 | currency }}</span></p>
              </b-card>
              <b-card header="Daily">
                <p>Income: {{ calculated.yearly.in/365 | currency }}</p>
                <p>Expenses: {{ calculated.yearly.out/365 | currency }}</p>
                <p>Profit: <span :class="calculated.yearly.sum/365 < 0 ? 'text-danger' : 'text-success'">{{ calculated.yearly.sum/365 | currency }}</span></p>
              </b-card>
            </b-card-group>
            </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="inputs">
      <Input title="Income" color="success" :entries="income" />
      <Input title="Expenses" color="danger" :entries="expenses" />
    </b-row>
    <b-modal id="modalImport" title="Import" @ok="importData" @show="resetImport" @hidden="resetImport">
      <form ref="import" @submit.stop.prevent="importData">
        <b-form-group
          label="Data: "
          label-for="data-input"
          invalid-feedback="Correct data is required"
          :state="importDataState"
        >
          <b-form-textarea
            id="data-input"
            v-model="importdata"
            :state="importDataState"
            rows="5"
            no-resize
            required
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Input from './components/Input'
import Frequency from './enums/Frequency'

export default {
  name: 'App',
  components: {
    Input
  },
  data () {
    return {
      income: [],
      expenses: [],
      calculated: {
        yearly: {
          in: 0,
          out: 0,
          sum: 0
        },
        in: {
          title: 'Income',
          labels: [],
          data: []
        },
        out: {
          title: 'Expenses',
          labels: [],
          data: []
        },
        inTag: {
          title: 'Income Tags',
          labels: [],
          data: []
        },
        outTag: {
          title: 'Expenses Tags',
          labels: [],
          data: []
        }
      },
      pieStyle: {
        backgroundColor: '#ffffff00',
        pieOuterFontColor: '#ccc',
        legendFontColor: '#ccc'
      },
      importdata: '',
      importDataState: null
    }
  },
  mounted () {
    const storage = localStorage.getItem('expenses')
    if (storage) {
      try {
        const storageObj = JSON.parse(storage)
        if (storageObj.expenses && storageObj.income) {
          this.$set(this, 'expenses', storageObj.expenses)
          this.$set(this, 'income', storageObj.income)
          this.income.forEach(i => this.$set(i, '_showDetails', false))
          this.expenses.forEach(i => this.$set(i, '_showDetails', false))
        }
      } catch (e) {
      }
    }

    this.calculate()
  },
  watch: {
    income: {
      deep: true,
      handler: 'calculate'
    },
    expenses: {
      deep: true,
      handler: 'calculate'
    }
  },
  methods: {
    calculate () {
      const storage = JSON.stringify({expenses: this.expenses, income: this.income})
      localStorage.setItem('expenses', storage)

      let calc = {
        in: 0,
        out: 0,
        sum: 0
      }
      let inLabel = []
      let inData = []
      let outLabel = []
      let outData = []
      let inTagLabel = ['Without Tags']
      let inTagData = [0]
      let outTagLabel = ['Without Tags']
      let outTagData = [0]

      const inList = [...this.income.map(i => {
        return {
          name: i.name,
          tags: i.tags,
          amount: Frequency.byId(i.frequency).interval * parseFloat(i.amount)
        }
      }), ...this.income.filter(i => i.frequency === 0).map(i => {
        return {
          name: i.name,
          tags: i.tags,
          amount: parseFloat(i.amount)
        }
      })]
      const outList = [...this.expenses.map(i => {
        return {
          name: i.name,
          tags: i.tags,
          amount: Frequency.byId(i.frequency).interval * parseFloat(i.amount)
        }
      }), ...this.expenses.filter(i => i.frequency === 0).map(i => {
        return {
          name: i.name,
          tags: i.tags,
          amount: parseFloat(i.amount)
        }
      })]
      calc.in = inList.reduce((c, v) => c + v.amount, 0)
      calc.out = outList.reduce((c, v) => c + v.amount, 0)

      calc.sum = calc.in - calc.out

      if (calc.sum < 0) {
        inList.push({
          name: 'Loss',
          amount: -calc.sum,
          tags: ['Loss']
        })
      } else {
        outList.push({
          name: 'Profit',
          amount: calc.sum,
          tags: ['Profit']
        })
      }

      inList.forEach(e => {
        inLabel.push(e.name)
        inData.push(e.amount)

        if (!e.tags) {
          inTagData[0] += e.amount
          return
        }

        // TODO: maybe consider using only the first tag, else the total will change because elements get included multiple times
        e.tags.forEach(t => {
          let index = inTagLabel.indexOf(t)
          if (index === -1) {
            inTagLabel.push(t)
            inTagData.push(e.amount)
          } else {
            inTagData[index] += e.amount
          }
        })
      })
      outList.forEach(e => {
        outLabel.push(e.name)
        outData.push(e.amount)

        if (!e.tags) {
          outTagData[0] += e.amount
          return
        }

        e.tags.forEach(t => {
          let index = outTagLabel.indexOf(t)
          if (index === -1) {
            outTagLabel.push(t)
            outTagData.push(e.amount)
          } else {
            outTagData[index] += e.amount
          }
        })
      })

      if (outTagData[0] === 0) {
        outTagData.shift()
        outTagLabel.shift()
      }
      if (inTagData[0] === 0) {
        inTagData.shift()
        inTagLabel.shift()
      }

      // sort asc
      const sort = (label, data) => {
        let merge = label.map((e, i) => {
          return {
            label: e,
            data: data[i]
          }
        }).sort((a, b) => b.data - a.data)

        label = merge.map(e => e.label)
        data = merge.map(e => e.data)

        return [label, data]
      }

      [inTagLabel, inTagData] = sort(inTagLabel, inTagData);
      [outTagLabel, outTagData] = sort(outTagLabel, outTagData);
      [inLabel, inData] = sort(inLabel, inData);
      [outLabel, outData] = sort(outLabel, outData)

      this.$set(this.calculated, 'yearly', calc)
      this.$set(this.calculated.inTag, 'labels', inTagLabel)
      this.$set(this.calculated.inTag, 'data', inTagData)
      this.$set(this.calculated.outTag, 'labels', outTagLabel)
      this.$set(this.calculated.outTag, 'data', outTagData)

      this.$set(this.calculated.in, 'labels', inLabel)
      this.$set(this.calculated.in, 'data', inData)
      this.$set(this.calculated.out, 'labels', outLabel)
      this.$set(this.calculated.out, 'data', outData)
    },
    dataFormat (a, b) {
      if (b) return this.$options.filters.currency(b)
      return a
    },
    askReset () {
      // ask before deletion
      this.$bvModal.msgBoxConfirm(['Please confirm that you want to reset.', 'All data will be lost forever! (A long time!)'].map(e => this.$createElement('p', [e])), {
        title: 'Are you sure?',
        size: 'md',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Yes',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(confirmedDelete => {
          if (!confirmedDelete) return

          this.$set(this, 'expenses', [])
          this.$set(this, 'income', [])
          this.calculate()
        })
    },
    resetImport () {
      this.importdata = ''
      this.importDataState = null
    },
    importData (bvModalEvt) {
      let valid = this.$refs.import.checkValidity()
      let obj
      if (valid) {
        try {
          obj = JSON.parse(atob(this.importdata))
          if (!obj.expenses || !obj.income) {
            valid = false
          }
        } catch (e) {
          valid = false
        }
      }

      this.importDataState = valid
      if (bvModalEvt) bvModalEvt.preventDefault()
      if (!valid) return

      this.$set(this, 'expenses', obj.expenses)
      this.$set(this, 'income', obj.income)
      this.income.forEach(i => this.$set(i, '_showDetails', false))
      this.expenses.forEach(i => this.$set(i, '_showDetails', false))
      this.calculate()

      this.$nextTick(() => {
        this.$bvModal.hide('modalImport')
      })
    },
    exportData () {
      const storage = localStorage.getItem('expenses')
      if (!storage) return

      const el = document.createElement('textarea')
      el.value = btoa(storage)
      el.setAttribute('readonly', '')
      el.style.all = 'position: absolute; left: -9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      this.$refs.exportTooltip.$emit('open')

      setTimeout(() => this.$refs.exportTooltip.$emit('close'), 1000)
    }
  }
}
</script>

<style>
body {
  overflow-y: scroll;
}
.inputs {
  margin-top: 20px;
}
/* width */
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--gray);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--dark);
  border-radius: 6px 6px 6px 6px / 12px 12px 12px 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
