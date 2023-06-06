# %%
import matplotlib.pyplot as plt
import numpy as np
from analysis import nw_performance, sw_performance

# %%
# set width of bar
barWidth = 0.25
fig = plt.subplots(figsize=(12, 8))

# set height of bar

# Set position of bar on X axis
br1 = np.arange(len(nw_performance))
br2 = [x + barWidth for x in br1]

# Make the plot
plt.bar(br1, sw_performance, color='r', width=barWidth,
        edgecolor='grey', label='Smith-Waterman')
plt.bar(br2, nw_performance, color='g', width=barWidth,
        edgecolor='grey', label='Needle-man Wunsch')

plt.title('Performance Analysis', fontweight='bold', fontsize=20)
plt.xlabel('Key Sizes', fontweight='bold', fontsize=15)
plt.ylabel('Time (seconds)', fontweight='bold', fontsize=15)
plt.xticks([r + barWidth for r in range(len(nw_performance))],
           ['10', '100', '1000', '10000', '100000', '1000000'])

plt.legend()
plt.show()

# %%
plt.cla()
# set height of bar

# Set position of bar on X axis
br1 = np.arange(len(nw_performance))
br2 = [x + barWidth for x in br1]

# Make the plot
plt.plot(br1, sw_performance, color='r', label='Smith-Waterman')
plt.plot(br2, nw_performance, color='g', label='Needle-man Wunsch')

plt.title('Performance Analysis Over Time', fontweight='bold', fontsize=20)
plt.xlabel('Key Sizes', fontweight='bold', fontsize=15)
plt.ylabel('Time (seconds)', fontweight='bold', fontsize=15)
plt.xticks([r + barWidth for r in range(len(nw_performance))],
           ['10', '100', '1000', '10000', '100000', '1000000'])

plt.legend()
plt.show()