<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class RecallCounter implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $counter;
    public $chanel;
    /**
     * Create a new event instance.
     */
    public function __construct($counter, $chanel)
    {
        $this->counter = $counter;
        $this->chanel = $chanel;
    }

    public function broadcastAs()
    {
        return 'newRecall';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel(strval($this->chanel)),
        ];
    }
}
