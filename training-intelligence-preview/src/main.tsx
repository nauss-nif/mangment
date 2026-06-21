import React from 'react'
import { createRoot } from 'react-dom/client'
import TrainingIntelligenceApp from '../../src/components/TrainingIntelligence/TrainingIntelligenceApp'
import './styles.css'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(<TrainingIntelligenceApp />)
}
