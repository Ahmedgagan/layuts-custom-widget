import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import Category from "discourse/models/category";

let layouts;

try {
  layouts = requirejs(
    "discourse/plugins/discourse-layouts/discourse/lib/layouts"
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  console.warn(error);
}

export default layouts.createLayoutsWidget("custom-list", {
  defaultState() {
    const topicTracking = this.register.lookup("topic-tracking-state:main");

    return {
      topicTracking,
    };
  },

  didRenderWidget() {
    const self = this;
    this.state.topicTracking.addObserver("states", function () {
      self.scheduleRerender();
    });
  },

  html() {
    let list = [];

    list.push(
      this.attach("layouts-custom-list-item", {
        title: "Latest",
        url: "/latest",
      })
    );

    list.push(
      this.attach("layouts-custom-list-item", {
        title: "Watched",
        url: "/latest?state=watching",
      })
    );

    list.push(
      this.attach("layouts-custom-list-item", {
        title: "Tasks",
        count: this.state.topicTracking.customCount(Category.findById(7)),
        url: `/u/${this.currentUser.username}/activity/bookmarks?plain`,
      })
    );

    list.push(
      this.attach("layouts-custom-list-item", {
        title: "Help wanted",
        count: this.currentUser.bookmark_count,
        url: "/c/7",
      })
    );

    return h("div.layouts-custom-widget", h("ul.parent-categories", list));
  },
});

createWidget("layouts-custom-list-item", {
  tagName: `li.layouts-custom-list-item`,

  buildKey: (attrs) =>
    `layouts-custom-list-item-${attrs.title.toLowerCase().replace(/ /g, "-")}`,

  buildClasses(attrs) {
    let classes = [];
    let data = Object.assign(
      {},
      document.getElementById("data-discourse-setup").dataset
    );
    let baseUrl = data && data.baseUrl ? data.baseUrl : "";
    let url = baseUrl + attrs.url;
    let currentUrl = window.location.href;

    if (url === currentUrl) {
      classes.push("active");
    }

    return classes;
  },

  html(attrs) {
    let customListItemList = [attrs.title];

    if (attrs.count > 0) {
      customListItemList.push(h("span.count", attrs.count.toString()));
    }

    return h("a", { attributes: { href: attrs.url } }, [
      h("p.title", customListItemList),
    ]);
  },
});
