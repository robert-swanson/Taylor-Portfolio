import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import AdminDrivers from "./pages/AdminDrivers.vue";
import AdminRides from "./pages/AdminRides.vue";
import AdminVehicles from "./pages/AdminVehicles.vue";
import Driver from "./pages/Driver.vue";
import Passenger from "./pages/Passenger.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home},
    { name: "admin-vehicles", path: "/admin/vehicles", component: AdminVehicles },
    { name: "admin-rides", path: "/admin/rides", component: AdminRides },
    { name: "admin-drivers", path: "/admin/drivers", component: AdminDrivers },
    { name: "passenger", path: "/passenger", component: Passenger },
    { name: "driver", path: "/driver", component: Driver },
  ]
});
