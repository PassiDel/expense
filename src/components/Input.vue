<template>
  <b-col md="6">
    <b-card no-body>
      <b-card-header :header-bg-variant="color" header-text-variant="white" class="container-fluid">
        <b-row>
          <b-col md="10">
            <h3 class="w-75 p-3">{{ title }}</h3>
          </b-col>
          <b-col md="2" class="float-right align-self-center">
            <b-button @click="add()" variant="primary" size="lg"><b-icon-plus /></b-button>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <b-table :fields="fields" :items="data" responsive="sm" v-model="currentItems">
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>

          <template #cell(options)="data">
            <b-button-group size="sm">
              <b-button @click="toggleDetails(data)" v-b-tooltip.hover :title="data.detailsShowing ? 'Cancel' : 'Edit'" :variant="data.detailsShowing ? 'outline-danger' : 'primary'">
                <b-icon-x-square v-if="data.detailsShowing" />
                <b-icon-pencil-square v-else />
              </b-button>
              <b-button @click="askDelete(data)" v-b-tooltip.hover title="Remove" variant="danger"><b-icon-trash /></b-button>
            </b-button-group>
          </template>

          <template #cell()="data">
            {{ data.value }}
          </template>

          <template #cell(amount)="data">
            {{ data.item.amount | currency }}
          </template>

          <template #cell(frequency)="data">
            {{ $enums.Frequency.byId(data.item.frequency).name }}
          </template>

          <template #row-details="row">
            <b-card>
              <b-form @submit.prevent="save(row)">
                <b-form-group
                id="name-group"
                label="Name:"
                label-for="name">
                  <b-form-input
                    id="name"
                    v-model="editingCache.name"
                    type="text"
                    placeholder="Name"
                    required></b-form-input>
                </b-form-group>

                <b-form-group
                  id="amount-group"
                  label="Amount:"
                  label-for="amount">
                  <b-input-group append="€" class="mb-2 mr-sm-2 mb-sm-0">
                    <b-form-input
                      id="amount"
                      v-model="editingCache.amount"
                      type="number"
                      placeholder="0,00"
                      step="0.01"
                      min="0.01"
                      required></b-form-input>
                  </b-input-group>
                </b-form-group>

                <b-form-group
                  id="frequency-group"
                  label="Frequency:"
                  label-for="frequency">
                  <b-form-select
                    id="frequency"
                    v-model="editingCache.frequency"
                    type="text"
                    :options="$enums.Frequency.options()"
                    required></b-form-select>
                </b-form-group>

                <b-button type="submit" variant="success"><b-icon-check /> Save</b-button>
              </b-form>
            </b-card>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script>
import Vue from 'vue'
import Frequency from '../enums/Frequency'

export default {
  name: 'Input',
  enums: {
    Frequency
  },
  props: [
    'title',
    'color',
    'entries'
  ],
  data () {
    return {
      fields: [
        {
          key: 'index',
          label: '#'
        },
        'name',
        'amount',
        'frequency',
        {
          key: 'options',
          label: ''
        }
      ],
      data: [],
      currentItems: [],
      editingCache: undefined,
      editing: undefined
    }
  },
  mounted () {
    this.$set(this, 'data', this.$props.entries)
  },
  methods: {
    add () {
      this.data.push({
        name: '',
        amount: 1.00,
        frequency: 0
      })

      this.toggleDetails({index: this.data.length - 1, toggleDetails: () => {}})
    },
    askDelete (row) {
      // ask before deletion
      this.$bvModal.msgBoxConfirm(`Please confirm that you want to delete '${row.item.name}'?`, {
        title: 'Are you sure?',
        size: 'sm',
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
          this.data.splice(row.index, 1)
        })
    },
    save (row) {
      // override active data with from cache
      this.$set(this.data, row.index, this.editingCache)
      this.toggleDetails(row)
    },
    toggleDetails (row) {
      // close all open details
      this.currentItems.forEach((item, i) => {
        if (i === row.index) return
        this.$set(item, '_showDetails', false)
      })

      // create (or reset) local copy for form data
      if (row.detailsShowing) {
        this.editingCache = undefined
      } else {
        this.editingCache = Vue.util.extend({}, row.item)
      }

      row.toggleDetails()
    }
  },
  watch: {
    data: {
      deep: true,
      handler () {
        this.$emit('input', this.data)
      }
    },
    entries: {
      deep: true,
      handler () {
        this.$set(this, 'data', this.$props.entries)
      }
    }
  }
}
</script>

<style>
/* highlight selected row */
.b-table-has-details {
  background: var(--gray);
  color: var(--white);
}
.b-table-has-details + tr {
  background: var(--gray);
}
</style>
