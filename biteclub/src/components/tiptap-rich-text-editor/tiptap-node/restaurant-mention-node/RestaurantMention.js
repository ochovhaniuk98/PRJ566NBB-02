import { Mention } from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import SuggestionList from './SuggestionList';
import './restaurantMention.scss';

export const RestaurantMention = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      {
        ...HTMLAttributes,
        class: 'restaurant-mention',
        href: `/restaurants/${node.attrs.id}`, // link to restaurant page
        target: '_blank', // open in new tab (optional)
        rel: 'noopener noreferrer', // security best practice
      },
      `@${node.attrs.label}`,
    ];
  },
}).configure({
  HTMLAttributes: {
    class: 'restaurant-mention',
  },
  suggestion: {
    char: '@',
    startOfLine: false,

    items: async ({ query }) => {
      const res = await fetch(`/api/restaurants/search?q=${query}`);
      const data = await res.json();
      const restaurants = Array.isArray(data) ? data : data.restaurants || [];
      return restaurants.map(r => ({ id: r._id, label: r.name }));
    },

    render: () => {
      let component;
      let popup;

      return {
        onStart: props => {
          component = new ReactRenderer(SuggestionList, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
          });
        },

        onUpdate(props) {
          component.updateProps(props);
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  },
});
