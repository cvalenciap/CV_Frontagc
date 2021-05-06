import {NgModule} from '@angular/core';

import {SpinnerChasingDotsComponent} from './spinner-chasing-dots.component';
import {SpinnerCircleComponent} from './spinner-circle.component';
import {SpinnerCubeGridComponent} from './spinner-cube-grid.component';
import {SpinnerDoubleBounceComponent} from './spinner-double-bounce.component';
import {SpinnerFadingCircleComponent} from './spinner-fading-circle.component';
import {SpinnerPulseComponent} from './spinner-pulse.component';
import {SpinnerRotaingPlaneComponent} from './spinner-rotaing-plane.component';
import {SpinnerThreeBounceComponent} from './spinner-three-bounce.component';
import {SpinnerWanderingCubesComponent} from './spinner-wandering-cubes.component';
import {SpinnerWaveComponent} from './spinner-wave.component';
import {SpinnerWordPressComponent} from './spinner-word-press.component';

@NgModule({
  declarations: [
    SpinnerRotaingPlaneComponent,
    SpinnerChasingDotsComponent,
    SpinnerCircleComponent,
    SpinnerCubeGridComponent,
    SpinnerDoubleBounceComponent,
    SpinnerFadingCircleComponent,
    SpinnerPulseComponent,
    SpinnerThreeBounceComponent,
    SpinnerWanderingCubesComponent,
    SpinnerWaveComponent,
    SpinnerWordPressComponent
  ],
  exports     : [
    SpinnerRotaingPlaneComponent,
    SpinnerChasingDotsComponent,
    SpinnerCircleComponent,
    SpinnerCubeGridComponent,
    SpinnerDoubleBounceComponent,
    SpinnerFadingCircleComponent,
    SpinnerPulseComponent,
    SpinnerThreeBounceComponent,
    SpinnerWanderingCubesComponent,
    SpinnerWaveComponent,
    SpinnerWordPressComponent
  ],
})

export class SpinKitModule {}
