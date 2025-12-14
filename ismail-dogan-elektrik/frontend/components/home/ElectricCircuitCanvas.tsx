"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  pulsePhase: number;
  size: number;
}

interface Spark {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface ElectricCircuitCanvasProps {
  className?: string;
}

export default function ElectricCircuitCanvas({
  className = "",
}: ElectricCircuitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  // Configuration
  const config = {
    nodeCount: 50,
    connectionDistance: 180,
    mouseInfluenceRadius: 200,
    sparkProbability: 0.02,
    neonBlue: { r: 0, g: 163, b: 255 },
    neonCyan: { r: 0, g: 240, b: 255 },
    amber: { r: 245, g: 158, b: 11 },
  };

  // Initialize nodes
  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 3,
      });
    }
    nodesRef.current = nodes;
  }, [config.nodeCount]);

  // Create spark between two nodes
  const createSpark = useCallback((fromNode: Node, toNode: Node) => {
    sparksRef.current.push({
      x: fromNode.x,
      y: fromNode.y,
      targetX: toNode.x,
      targetY: toNode.y,
      progress: 0,
      speed: 0.02 + Math.random() * 0.03,
      trail: [],
    });
  }, []);

  // Draw function
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const sparks = sparksRef.current;
      const mouse = mouseRef.current;
      const time = timeRef.current;

      // Update node positions
      nodes.forEach((node, i) => {
        // Mouse repulsion
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < config.mouseInfluenceRadius && distToMouse > 0) {
          const force = (config.mouseInfluenceRadius - distToMouse) / config.mouseInfluenceRadius;
          node.vx += (dx / distToMouse) * force * 0.5;
          node.vy += (dy / distToMouse) * force * 0.5;
        }

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Boundary wrapping
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Update pulse phase
        node.pulsePhase += 0.02;

        // Find connections
        node.connections = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          if (dist < config.connectionDistance) {
            node.connections.push(j);

            // Randomly create sparks
            if (Math.random() < config.sparkProbability * 0.1) {
              createSpark(node, other);
            }
          }
        }
      });

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const other = nodes[j];
          const dist = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          const alpha = 1 - dist / config.connectionDistance;
          const pulse = 0.3 + 0.7 * Math.sin(time * 0.002 + node.pulsePhase);

          // Connection line
          const gradient = ctx.createLinearGradient(
            node.x,
            node.y,
            other.x,
            other.y
          );
          gradient.addColorStop(
            0,
            `rgba(${config.neonBlue.r}, ${config.neonBlue.g}, ${config.neonBlue.b}, ${alpha * pulse * 0.5})`
          );
          gradient.addColorStop(
            0.5,
            `rgba(${config.neonCyan.r}, ${config.neonCyan.g}, ${config.neonCyan.b}, ${alpha * pulse * 0.8})`
          );
          gradient.addColorStop(
            1,
            `rgba(${config.neonBlue.r}, ${config.neonBlue.g}, ${config.neonBlue.b}, ${alpha * pulse * 0.5})`
          );

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + node.pulsePhase);
        const glowSize = node.size + pulse * 4;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowSize * 3
        );
        gradient.addColorStop(
          0,
          `rgba(${config.neonBlue.r}, ${config.neonBlue.g}, ${config.neonBlue.b}, ${0.8 * pulse})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(${config.neonCyan.r}, ${config.neonCyan.g}, ${config.neonCyan.b}, ${0.3 * pulse})`
        );
        gradient.addColorStop(1, "rgba(0, 163, 255, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + 0.2 * pulse})`;
        ctx.arc(node.x, node.y, node.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw sparks
      sparksRef.current = sparks.filter((spark) => {
        spark.progress += spark.speed;

        // Current position
        const x = spark.x + (spark.targetX - spark.x) * spark.progress;
        const y = spark.y + (spark.targetY - spark.y) * spark.progress;

        // Add to trail
        spark.trail.push({ x, y, alpha: 1 });

        // Update trail
        spark.trail = spark.trail
          .map((point) => ({ ...point, alpha: point.alpha * 0.9 }))
          .filter((point) => point.alpha > 0.01);

        // Draw trail
        spark.trail.forEach((point, i) => {
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            8
          );
          gradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${point.alpha})`
          );
          gradient.addColorStop(
            0.3,
            `rgba(${config.neonCyan.r}, ${config.neonCyan.g}, ${config.neonCyan.b}, ${point.alpha * 0.8})`
          );
          gradient.addColorStop(1, "rgba(0, 240, 255, 0)");

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw spark head
        if (spark.progress < 1) {
          const headGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
          headGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          headGradient.addColorStop(
            0.3,
            `rgba(${config.neonCyan.r}, ${config.neonCyan.g}, ${config.neonCyan.b}, 0.9)`
          );
          headGradient.addColorStop(1, "rgba(0, 240, 255, 0)");

          ctx.beginPath();
          ctx.fillStyle = headGradient;
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();
        }

        return spark.progress < 1 || spark.trail.length > 0;
      });

      // Draw grid lines (subtle)
      ctx.strokeStyle = "rgba(0, 163, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Scan line effect
      const scanY = (time * 0.1) % height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      scanGradient.addColorStop(0, "rgba(0, 163, 255, 0)");
      scanGradient.addColorStop(0.5, "rgba(0, 163, 255, 0.05)");
      scanGradient.addColorStop(1, "rgba(0, 163, 255, 0)");

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 50, width, 100);
    },
    [config, createSpark]
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += 16;
    draw(ctx, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initNodes(width, height);
  }, [initNodes]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // Setup and cleanup
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, handleMouseMove, handleMouseLeave, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "auto" }}
    />
  );
}
