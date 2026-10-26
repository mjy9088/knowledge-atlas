import type {ArticleAPI} from '../apps/web/pages/article/controller.js';
import type {lessonAPI,LessonExperiment} from '../apps/web/pages/lesson/controller.js';

declare global {
  interface Window {
    __atlasRelated: ArticleAPI;
    __atlasLesson: typeof lessonAPI;
    __atlasLessonExperiment: LessonExperiment;
  }
}
export {};
