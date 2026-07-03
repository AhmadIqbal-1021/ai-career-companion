// server/src/routes/discoveries.routes.js

import { Router } from 'express'
import { 
  getDiscoveries, createDiscovery, 
  updateDiscovery, deleteDiscovery 
} from '../controllers/discoveries.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { body } from 'express-validator'
import { handleValidationErrors } from '../middleware/validate.middleware.js'

const router = Router()

router.use(authenticate)

const discoveryValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('source').optional().isIn(['linkedin','whatsapp','company_website','rozee','mustakbil','other']),
  body('status').optional().isIn(['saved','applied','expired']),
]

router.get('/', getDiscoveries)
router.post('/', discoveryValidation, handleValidationErrors, createDiscovery)
router.put('/:id', updateDiscovery)
router.delete('/:id', deleteDiscovery)

export default router