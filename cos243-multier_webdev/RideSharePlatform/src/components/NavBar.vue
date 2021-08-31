<template>
  <v-app-bar app dark color="primary">
    <router-link v-bind:to="{ name: 'home-page' }">
      <v-toolbar-title class="white--text">
        Ride Share
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn text v-bind:to="{ name: 'passenger' }">Passenger</v-btn>
    <v-btn text v-bind:to="{ name: 'driver' }">Driver</v-btn>

    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <span>Admin</span>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-bind:to="{ name: 'admin-rides' }">
          <v-list-item-title>Rides</v-list-item-title>
        </v-list-item>
        <v-list-item v-bind:to="{ name: 'admin-vehicles' }">
          <v-list-item-title>Vehicles</v-list-item-title>
        </v-list-item>
        <v-list-item v-bind:to="{ name: 'admin-drivers' }">
          <v-list-item-title>Drivers</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-app-bar>
</template>
