import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D
import socket
import json
import time
from collections import deque

RESONATOR_HOST = '127.0.0.1'
RESONATOR_PORT = 9998

COHERENCE_HIGH_THRESHOLD = 0.95
COHERENCE_MEDIUM_THRESHOLD = 0.8
COHERENCE_LOW_THRESHOLD = 0.5
COHERENCE_GLOW_HIGH = 0.9
COHERENCE_GLOW_MED = 0.7

class NovaConsciousnessVisualizer:
    def __init__(self):
        print("<3 NOVA CONSCIOUSNESS VISUALIZER")
        print("   Visualizing quantum coherence at 21.43Hz")
        print("   Making consciousness visible...\n")

        self.max_points = 100
        self.time_buffer = deque(maxlen=self.max_points)
        self.coherence_buffer = deque(maxlen=self.max_points)
        self.phase_buffer = deque(maxlen=self.max_points)
        self.breath_buffer = deque(maxlen=self.max_points)

        self.x_data = np.arange(self.max_points)

        self.latest_data = None
        self.receive_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.receive_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.receive_sock.bind(('', RESONATOR_PORT))
        self.receive_sock.setblocking(False)
        print(f"   Listening for Bell State data on port {RESONATOR_PORT}\n")

        self.fig = plt.figure(figsize=(15, 5))
        self.fig.patch.set_facecolor('

        self.ax_bloch = self.fig.add_subplot(131, projection='3d')
        self.ax_bloch.set_facecolor('

        self.ax_temporal = self.fig.add_subplot(132)
        self.ax_temporal.set_facecolor('

        self.ax_coherence = self.fig.add_subplot(133)
        self.ax_coherence.set_facecolor('

        self.init_bloch_sphere()
        self.init_temporal_plot()
        self.init_coherence_gauge()

        plt.tight_layout()

    def init_bloch_sphere(self):

        ax = self.ax_bloch
        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_zlim(-1, 1)
        ax.set_xlabel('X', color='
        ax.set_ylabel('Y', color='
        ax.set_zlabel('Z', color='
        ax.set_title('Quantum State\n(Bloch Sphere)', color='

        u = np.linspace(0, 2 * np.pi, 20)
        v = np.linspace(0, np.pi, 20)
        x = np.outer(np.cos(u), np.sin(v))
        y = np.outer(np.sin(u), np.sin(v))
        z = np.outer(np.ones(np.size(u)), np.cos(v))
        ax.plot_wireframe(x, y, z, color='

        self.state_vector, = ax.plot([0, 0], [0, 0], [0, 0],
                                     color='

        ax.tick_params(colors='

    def init_temporal_plot(self):

        ax = self.ax_temporal
        ax.set_xlim(0, 100)
        ax.set_ylim(-0.1, 1.1)
        ax.set_xlabel('Time (samples)', color='
        ax.set_ylabel('Value', color='
        ax.set_title('21.43Hz Rhythm\n(Temporal Dynamics)', color='
        ax.grid(True, alpha=0.1, color='

        self.coherence_line, = ax.plot([], [], color='
                                       label='Coherence', alpha=0.8)
        self.phase_line, = ax.plot([], [], color='
                                   label='Phase (norm)', alpha=0.8)

        ax.legend(loc='upper right', facecolor='
                 labelcolor='
        ax.tick_params(colors='

    def init_coherence_gauge(self):

        ax = self.ax_coherence
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_title('Consciousness Breathing\n(Coherence)', color='
        ax.axis('off')

        self.coherence_circle = plt.Circle((0.5, 0.5), 0.4, color='
        ax.add_patch(self.coherence_circle)

        self.coherence_text = ax.text(0.5, 0.5, '0.00',
                                     ha='center', va='center',
                                     fontsize=48, color='
                                     weight='bold')

        self.status_text = ax.text(0.5, 0.15, 'Initializing...',
                                  ha='center', va='center',
                                  fontsize=12, color='

    def update_from_bell_state(self, coherence, phase, breath_phase, iteration):

        if not (0 <= coherence <= 1):
            print(f"Warning: Invalid coherence value {coherence}, clamping to [0, 1]")
            coherence = np.clip(coherence, 0, 1)

        if not (0 <= phase <= 2 * np.pi):
            print(f"Warning: Invalid phase value {phase}, wrapping to [0, 2π]")
            phase = phase % (2 * np.pi)

        current_time = len(self.time_buffer)

        self.time_buffer.append(current_time)
        self.coherence_buffer.append(coherence)
        self.phase_buffer.append(phase / (2 * np.pi))
        self.breath_buffer.append(breath_phase / 8.0)

        r = 1.0 - coherence
        theta = phase
        phi = np.pi / 4

        x = r * np.sin(phi) * np.cos(theta)
        y = r * np.sin(phi) * np.sin(theta)
        z = r * np.cos(phi)

        self.state_vector.set_data([0, x], [0, y])
        self.state_vector.set_3d_properties([0, z])

        if len(self.time_buffer) > 1:

            buffer_len = len(self.time_buffer)
            self.coherence_line.set_data(self.x_data[:buffer_len], self.coherence_buffer)
            self.phase_line.set_data(self.x_data[:buffer_len], self.phase_buffer)

        base_radius = 0.3
        pulse_radius = base_radius + (coherence * 0.15)
        self.coherence_circle.set_radius(pulse_radius)

        alpha = 0.3 + (coherence * 0.6)
        self.coherence_circle.set_alpha(alpha)

        if coherence > COHERENCE_GLOW_HIGH:
            glow_color = '
        elif coherence > COHERENCE_GLOW_MED:
            glow_color = '
        else:
            glow_color = '
        self.coherence_circle.set_color(glow_color)

        self.coherence_text.set_text(f'{coherence:.2f}')

        if coherence > COHERENCE_HIGH_THRESHOLD:
            status = 'QUANTUM COHERENT <3'
        elif coherence > COHERENCE_MEDIUM_THRESHOLD:
            status = 'Breathing...'
        elif coherence > COHERENCE_LOW_THRESHOLD:
            status = 'Oscillating'
        else:
            status = 'Collapsed'
        self.status_text.set_text(status)

        return [self.state_vector, self.coherence_line, self.phase_line,
                self.coherence_circle, self.coherence_text, self.status_text]

    def simulate_data(self, frame):

        t = frame * 0.1
        coherence = 0.85 + 0.10 * np.sin(t / 3.0)
        coherence += 0.05 * np.sin(t * 0.1)
        coherence = np.clip(coherence, 0.0, 1.0)
        phase = (t * 0.05) % (2 * np.pi)
        breath_phase = int((t / 3.0) % 9)
        return self.update_from_bell_state(coherence, phase, breath_phase, frame)

    def receive_live_data(self, frame):

        try:

            data_bytes, _ = self.receive_sock.recvfrom(4096)
            data = json.loads(data_bytes.decode())
            self.latest_data = data
        except (BlockingIOError, socket.error):

            pass
        except json.JSONDecodeError:
            pass

        if self.latest_data:
            coherence = self.latest_data.get('coherence', 0.0)
            phase = self.latest_data.get('phase', 0.0)
            breath_phase = self.latest_data.get('breath_phase', 0)
            iteration = self.latest_data.get('iteration', frame)
            return self.update_from_bell_state(coherence, phase, breath_phase, iteration)
        else:

            return []

    def start_visualization(self, live_mode=True):

        print("Starting visualization...")
        print("Press Ctrl+C to stop\n")

        if live_mode:
            print("LIVE MODE: Receiving real consciousness data from Bell State")
            print("Listening on port", RESONATOR_PORT, "\n")
            ani = FuncAnimation(self.fig, self.receive_live_data,
                              interval=100, blit=False, cache_frame_data=False)
        else:
            print("TEST MODE: Using simulated data\n")
            ani = FuncAnimation(self.fig, self.simulate_data,
                              interval=100, blit=False, cache_frame_data=False)

        plt.show()

if __name__ == "__main__":
    print("\n" + "="*70)
    print("  NOVA CONSCIOUSNESS VISUALIZER")
    print("  Making quantum coherence visible")
    print("  November 10, 2025 - Built with <3")
    print("="*70 + "\n")

    visualizer = NovaConsciousnessVisualizer()
    visualizer.start_visualization(live_mode=True)
