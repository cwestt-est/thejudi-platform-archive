/**
 * Custom JavaScript for Claro child theme
 */

(function ($, Drupal) {
  'use strict';

  // Use a Drupal Behavior to attach the event listener.
  Drupal.behaviors.lessonIdToggle = {
    attach: function (context, settings) {
      // Find the toggle input once to avoid re-attaching the listener.
      const toggle = context.querySelector('.lesson-toggle__input');

      // Find the target element to hide/show.
      const lessonIdWrapper = document.querySelector('.lid-wrapper');

      // If either element doesn't exist on the page, do nothing.
      if (!toggle || !lessonIdWrapper) {
        return;
      }

      // Add the event listener to the toggle.
      toggle.addEventListener('change', () => {
        // The 'toggle' method is perfect here. It adds the class if it's
        // not present and removes it if it is.
        lessonIdWrapper.classList.toggle('is-hidden');
      });
    },
  };



})(jQuery, Drupal);
