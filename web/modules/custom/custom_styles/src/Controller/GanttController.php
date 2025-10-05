<?php

namespace Drupal\custom_styles\Controller;

use Drupal\Core\Controller\ControllerBase;

class GanttController extends ControllerBase {
  public function ganttPage() {
    return [
      '#theme' => 'gantt_page',
      '#attached' => [
        'library' => [
          'custom_styles/gantt',
        ],
      ],
    ];
  }
}
