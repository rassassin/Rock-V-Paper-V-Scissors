const maxPerCell = 10;
const getAreaFilter = (area) => (p) => p.position.x >= area.x && p.position.x <= area.x + area.w && p.position.y >= area.y && p.position.y <= area.y + area.h;
const depthLimit = 20;

class QuadTree {
  constructor(x, y, w, h, depth = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.depth = depth;

    this.childParams = {
      TL: { x, y },
      TR: { x: x + w / 2, y },
      BL: { x, y: y + h / 2 },
      BR: { x: x + w / 2, y: y + h / 2 },
    };

    this.nodes = {
      TL: [],
      TR: [],
      BL: [],
      BR: [],
    };
  }

  add(entity) {
    let nodeKey = entity.position.y < this.y + this.h / 2 ? "T" : "B";
    nodeKey += entity.position.x < this.x + this.w / 2 ? "L" : "R";
    const node = this.nodes[nodeKey];
    if (Array.isArray(node)) {
      if (this.depth < depthLimit) {
        if (node.length >= maxPerCell) {
          const params = this.childParams[nodeKey];
          const qt = new QuadTree(params.x, params.y, this.w / 2, this.h / 2, this.depth + 1);
          for (const e of node) {
            qt.add(e);
          }
          qt.add(entity);
          this.nodes[nodeKey] = qt;
          return;
        }
      }
      node.push(entity);
      return;
    }
    node.add(entity);
  }

  query(range, position) {
    let points = [];
    const area = {
      x: position.x - range / 2,
      y: position.y - range / 2,
      w: range,
      h: range,
    };
    const areaFilter = getAreaFilter(area);
    for (const key in this.nodes) {
      const node = this.nodes[key];
      const childParams = this.childParams[key];
      const otherArea = Array.isArray(node) ? { x: childParams.x, y: childParams.y, w: this.w / 2, h: this.h / 2 } : node;
      if (this.isIntersecting(area, otherArea)) {
        if (Array.isArray(node)) {
          points = [...points, ...node.filter(areaFilter)];
          continue;
        }
        points = [...points, ...node.query(range, position).filter(areaFilter)];
      }
    }
    return points;
  }

  isIntersecting(a, b) {
    return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h;
  }

  show() {
    for (const key in this.nodes) {
      const node = this.nodes[key];
      if (Array.isArray(node)) {
        for (const entity of node) {
          entity.show();
        }
        continue;
      }
      node.show();
    }
  }
}
