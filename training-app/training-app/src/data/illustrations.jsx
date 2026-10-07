import ExerciseArt from '../components/ExerciseArt'
import { bodyPhases } from './bodyweight'

export const ILLUSTRATIONS = Object.fromEntries(
  bodyPhases.flatMap((phase) =>
    phase.workouts.map((workout) => {
      const name = workout.exercises[0].name
      return [
        name,
        <ExerciseArt
          key={`${workout.program}-${workout.day}`}
          program={workout.program}
          day={workout.day}
          label={name}
        />,
      ]
    }),
  ),
)
