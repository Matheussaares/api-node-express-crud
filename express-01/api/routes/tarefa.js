import { Router } from 'express';
import tarefaController from '../controllers/tarefaController';

const router = Router();

router.get('/', tarefaController.getTarefas);
router.post('/', tarefaController.createTarefa);
router.get('/:objectId', tarefaController.getTarefaById);
router.put('/:objectId', tarefaController.updateTarefa);
router.delete('/:objectId', tarefaController.deleteTarefa);

export default router;