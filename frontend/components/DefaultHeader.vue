<template>
  <div class="min-h-screen flex flex-col"> <header class="bg-base-200 py-4">
    <div class="container mx-auto px-4">
      <div class="navbar">
        <div class="navbar-start">
          <nuxt-link to="/" class="btn btn-ghost normal-case text-xl">
            Bonk Wars
          </nuxt-link>
        </div>
        <div class="navbar-end">
          <ul class="menu menu-horizontal px-1">
            <li>
              <nuxt-link to="/items">Items</nuxt-link>
            </li>
            <li>
             <AppKit />

            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
 </div>
</template>
<script setup lang="ts">
</script>