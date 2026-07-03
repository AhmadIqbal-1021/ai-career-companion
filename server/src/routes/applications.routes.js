    // server/src/routes/applications.routes.js

import { Router } from 'express'
import { 
  getApplications, getApplication,
  createApplication, updateApplication, 
  deleteApplication, getStats
} from '../controllers/applications.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { body } from 'express-validator'
import { handleValidationErrors } from '../middleware/validate.middleware.js'

const router = Router()

// All application routes require authentication
// Instead of adding authenticate to each route, apply it to the whole router
router.use(authenticate)

const applicationValidation = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('status').optional().isIn(['saved','applied','interview','rejected','offer'])
    .withMessage('Invalid status'),
]

router.get('/stats', getStats)
router.get('/', getApplications)
router.get('/:id', getApplication)
router.post('/', applicationValidation, handleValidationErrors, createApplication)
router.put('/:id', updateApplication)
router.delete('/:id', deleteApplication)

export default router