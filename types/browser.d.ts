import type {relatedAPI} from '../apps/web/pages/article/controller.js';
import type {lessonAPI,LessonExperiment} from '../apps/web/pages/lesson/controller.js';

declare global {
  interface Window {
    __atlasRelated: typeof relatedAPI;
    __atlasLesson: typeof lessonAPI;
    __atlasLessonExperiment: LessonExperiment;
  }
}
export {};
