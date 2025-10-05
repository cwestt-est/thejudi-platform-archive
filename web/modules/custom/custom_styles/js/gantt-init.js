(function (Drupal, drupalSettings) {
  Drupal.behaviors.ganttChart = {
    attach: function (context, settings) {
      console.log('Gantt behavior attached');

      const container = context.querySelector('#gantt-chart');
      if (!container) {
        console.log('Gantt container not found');
        return;
      }
      console.log('Gantt container found', container);

      // ✅ إضافة caption أسفل .page-title
      const titleEl = context.querySelector('.page-title');
      if (titleEl && !context.querySelector('.page-title + caption')) {
        const caption = document.createElement('caption');
        const today = new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        caption.textContent = `Today: ${today}`;
        titleEl.insertAdjacentElement('afterend', caption);
      }

      fetch('/goals-gantt.json?_format=json', { credentials: 'same-origin' })
        .then(res => {
          console.log('Fetch response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Fetched data:', data);

          const tasks = data.map(item => {
            const convertTimestamp = (timestamp) => {
              if (!timestamp) return null;
              const date = new Date(parseInt(timestamp, 10) * 1000);
              return date.toISOString().split('T')[0];
            };

            let progressPercentage = 0;
            const currentProgress = parseInt(item.progress, 10);
            const goal = parseInt(item.goal, 10);

            if (item.type === 'Precentage') {
              progressPercentage = currentProgress;
            } else if (item.type === 'Number' && goal > 0) {
              progressPercentage = Math.round((currentProgress / goal) * 100);
            }

            // ✅ Prepend percentage to goal name
            const displayName = goal > 0 
              ? `${progressPercentage}% - ${item.title}` 
              : item.title;

            return {
              id: item.id || item.title,
              name: displayName,  // Display percentage in front
              start: convertTimestamp(item.start),
              end: convertTimestamp(item.end),
              progress: progressPercentage,
              dependencies: item.dependencies || '',
              custom_type: item.type,
              custom_progress: currentProgress,
              custom_goal: goal
            };
          });

          console.log('Processed tasks:', tasks);

          new Gantt(container, tasks, {
            view_mode: 'Month',
            date_format: 'YYYY-MM-DD',
            custom_popup_html: task => {
              let progress_text = '';
              if (task.custom_type === 'Number') {
                progress_text = `<p><b>Progress:</b> ${task.custom_progress} / ${task.custom_goal} (${task.progress}%)</p>`;
              } else {
                progress_text = `<p><b>Progress:</b> ${task.progress}%</p>`;
              }
              return `
                <div class="gantt-popup">
                  <h5>${task.name}</h5>
                  <p>${task.start} → ${task.end}</p>
                  ${progress_text}
                </div>`;
            }
          });
        })
        .catch(err => console.error('Error fetching Gantt data:', err));
    }
  };
})(Drupal, drupalSettings);
