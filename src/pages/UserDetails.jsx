import React from 'react'
import Galaxy from '../common/background/GalaxyBackground'

function UserDetails() {
    return (
<div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Galaxy 
        mouseRepulsion={true}
        mouseInteraction={false}
        density={1.5}
        glowIntensity={0.5}
        saturation={0.8}
        hueShift={240}
      />
       
      </div>
    )
}

export default UserDetails