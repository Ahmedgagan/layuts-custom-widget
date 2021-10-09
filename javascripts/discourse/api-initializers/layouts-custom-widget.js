import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.12.3", api => {
  api.modifyClass('topic-tracking-state:main', {
    customCount(category) {
      let sum = 0;
      for (let topic of this.states.values()) {
        if (
          topic.category_id === category.id &&
          !topic.deleted && topic.created_at && !topic.closed && !topic.solved
        ) {
          sum +=
            topic.last_read_post_number === null ||
            topic.last_read_post_number < topic.highest_post_number
              ? 1
              : 0;
        }
      }
      return sum;
    },
  });
});
