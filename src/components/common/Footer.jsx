import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <footer className="bg-stardew-wood text-stardew-cream text-center py-6 border-t-4 border-black text-xs md:text-sm mt-auto w-full">
        <p>© 2026 Stardew Valley Shop - Proyecto de Desarrollo de Software.</p>
        <p className="text-stardew-gold/80 mt-1">
          Diseñado con la estética oficial del Valle en Componentes de Clase
        </p>
      </footer>
    )
  }
}

export default Footer