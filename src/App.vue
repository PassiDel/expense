<template>
  <div id="app" class="container">
    <b-row class="results">
      <b-col sm="12" offset-md="1" md="10">
        <b-card header="Result" title="Special title treatment">
          <b-card-text>With supporting text below as a natural lead-in to additional content.</b-card-text>
          <p>Income: {{ calculated.yearly.in | currency }}</p>
          <p>Expenses: {{ calculated.yearly.out | currency }}</p>
          <p>Profit: <span :class="calculated.yearly.sum < 0 ? 'text-danger' : 'text-success'">{{ calculated.yearly.sum | currency }}</span></p>
<!--          <b-button variant="primary" size="lg" @click="calculate">Calculate</b-button>-->
        </b-card>
      </b-col>
    </b-row>
    <b-row class="inputs">
      <Input title="Income" color="success" :entries="income" />
      <Input title="Expenses" color="danger" :entries="expenses" />
    </b-row>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Input from './components/Input'
import Frequency from './enums/Frequency'

export default {
  name: 'App',
  components: {
    Input,
    HelloWorld
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
        }
      }
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

      calc.in = [...this.income.map(i => Frequency.byId(i.frequency).interval * parseFloat(i.amount)), ...this.income.filter(i => i.frequency === 0).map(i => parseFloat(i.amount))].reduce((c, v) => c + v, 0)
      calc.out = [...this.expenses.map(i => Frequency.byId(i.frequency).interval * parseFloat(i.amount)), ...this.expenses.filter(i => i.frequency === 0).map(i => parseFloat(i.amount))].reduce((c, v) => c + v, 0)

      calc.sum = calc.in - calc.out

      this.$set(this.calculated, 'yearly', calc)
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
</style>
