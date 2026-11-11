import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 plugins:[react()],
 build:{rollupOptions:{output:{manualChunks(id){
  // The engine stays cacheable; it is fetched only with the lazy title scene.
  if(id.includes('/node_modules/three/src/')||id.includes('/node_modules/three/build/'))return 'three-core'
 }}}},
})
