import { CronAlertaComponent } from './cron-alertas/cron-alerta.component';
import { AlertaTemplateComponent } from './alertas-template/alerta-template.component';

export const AlertasRoutes = [
    {path: 'programacion-alertas', component: CronAlertaComponent},
    {path: 'mantenimiento-alertas', component: AlertaTemplateComponent},
];
