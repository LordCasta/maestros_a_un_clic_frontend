<template>
  <footer class="bg-gray-950 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div class="mb-5">
            <BrandMark size="sm" tone="light" :show-subtitle="false" />
          </div>

          <p class="text-sm leading-relaxed">
            Plataforma moderna para conectar clientes con profesionales confiables del hogar.
          </p>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-5">Servicios</h3>

          <ul class="space-y-3 text-sm">
            <li><a href="#servicios" class="hover:text-white transition">Plomería</a></li>
            <li><a href="#servicios" class="hover:text-white transition">Electricidad</a></li>
            <li><a href="#servicios" class="hover:text-white transition">Carpintería</a></li>
            <li><a href="#servicios" class="hover:text-white transition">Pintura</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-5">Empresa</h3>

          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition">Sobre nosotros</a></li>
            <li><a href="#" class="hover:text-white transition">Blog</a></li>
            <li><a href="#" class="hover:text-white transition">Soporte</a></li>
            <li><a href="#" class="hover:text-white transition">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-5">Seguridad</h3>

          <div class="space-y-4 text-sm">
            <div class="flex items-start gap-3">
              <ShieldCheck class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <p>Profesionales validados y con reseñas verificadas.</p>
            </div>

            <div class="flex items-start gap-3">
              <CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <p>Protección y soporte durante todo el proceso.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-14 pt-8 text-sm text-center">
        © 2026 Maestros a un clic. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { CheckCircle, ShieldCheck } from 'lucide-vue-next'

import BrandMark from '@/components/common/BrandMark.vue'
</script>

<style scoped></style>
