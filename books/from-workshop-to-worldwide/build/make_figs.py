"""Write every illustration as color and grayscale SVG."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from svglib import to_gray
from figures_diagrams import FIGS
from figures_scenes import SCENES

out = os.path.join(os.path.dirname(__file__), "..", "illustrations")
for sub in ("svg-color", "svg-gray"):
    os.makedirs(os.path.join(out, sub), exist_ok=True)
allf = {**FIGS, **SCENES}
only = set(sys.argv[1:])
for name, fn in allf.items():
    if only and name not in only:
        continue
    s = fn()
    open(os.path.join(out, "svg-color", name + ".svg"), "w").write(s)
    open(os.path.join(out, "svg-gray", name + ".svg"), "w").write(to_gray(s))
print(len(allf), "figures")
