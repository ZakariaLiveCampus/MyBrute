import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const ANIMATIONS = {
  IDLE: "idle",
  RUN: "run",
  ATTACK: "attack",
  HURT: "hurt",
  DEATH: "death",
  VICTORY: "climb",
};

const SPRITE_CONFIG = {
  frameWidth: 48,
  frameHeight: 48,
  scale: 2.5,
  bruteX: 150,
  opponentX: 450,
  y: 240,
  moveSpeed: 500,
  attackDistance: 100,
};

const ANIMATION_CONFIG = [
  {
    key: ANIMATIONS.RUN,
    file: "Biker_run.png",
    frames: 6,
    frameRate: 10,
    repeat: -1,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 5,
    },
  },
  {
    key: ANIMATIONS.IDLE,
    file: "Biker_idle.png",
    frames: 4,
    frameRate: 8,
    repeat: -1,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 3,
    },
  },
  {
    key: ANIMATIONS.ATTACK,
    file: "Biker_attack1.png",
    frames: 6,
    frameRate: 12,
    repeat: 0,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 5,
    },
  },
  {
    key: ANIMATIONS.HURT,
    file: "Biker_hurt.png",
    frames: 2,
    frameRate: 8,
    repeat: 0,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 1,
    },
  },
  {
    key: ANIMATIONS.DEATH,
    file: "Biker_death.png",
    frames: 6,
    frameRate: 10,
    repeat: 0,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 5,
    },
  },
  {
    key: ANIMATIONS.VICTORY,
    file: "Biker_climb.png",
    frames: 6,
    frameRate: 10,
    repeat: -1,
    frameConfig: {
      frameWidth: 48,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 5,
    },
  },
];

export default function CombatPhaser({
  bruteAction,
  opponentAction,
  onAnimationDone,
  onSceneReady, // nouveau callback
}) {
  const phaserRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  const handleAnimation = (sprite, action, isOpponent = false) => {
    if (!sprite || !sprite.anims) {
      console.warn("Sprite ou système d'animation non initialisé", { sprite });
      return;
    }
    const prefix = isOpponent ? "opponent" : "brute";
    const animationKey = `${action}_${prefix}`;
    console.log(`[CombatPhaser] handleAnimation`, {
      spriteName: sprite.name,
      action,
      animationKey,
    });
    const hasAnim = sprite.anims.animationManager.exists(animationKey);
    if (!hasAnim) {
      console.error(
        `[CombatPhaser] Animation non trouvée:`,
        animationKey,
        Array.from(sprite.anims.animationManager.anims.keys())
      );
    }

    sprite.scene.tweens?.killTweensOf(sprite);
    sprite.removeAllListeners("animationcomplete");

    const startPos = isOpponent
      ? SPRITE_CONFIG.opponentX
      : SPRITE_CONFIG.bruteX;
    const targetPos = isOpponent
      ? SPRITE_CONFIG.bruteX
      : SPRITE_CONFIG.opponentX;

    switch (action) {
      case ANIMATIONS.ATTACK:
        sprite.play(`${ANIMATIONS.RUN}_${prefix}`);
        sprite.scene.tweens.add({
          targets: sprite,
          x:
            targetPos -
            (isOpponent
              ? SPRITE_CONFIG.attackDistance
              : -SPRITE_CONFIG.attackDistance),
          duration: SPRITE_CONFIG.moveSpeed,
          onComplete: () => {
            sprite.play(animationKey);
            sprite.once("animationcomplete", () => {
              sprite.play(`${ANIMATIONS.RUN}_${prefix}`);
              sprite.scene.tweens.add({
                targets: sprite,
                x: startPos,
                duration: SPRITE_CONFIG.moveSpeed,
                onComplete: () => {
                  sprite.play(`${ANIMATIONS.IDLE}_${prefix}`);
                  if (onAnimationDone) onAnimationDone();
                },
              });
            });
          },
        });
        break;

      case ANIMATIONS.HURT:
        sprite.play(animationKey);
        sprite.scene.tweens.add({
          targets: sprite,
          x: sprite.x + (isOpponent ? -30 : 30),
          duration: 150,
          yoyo: true,
          onComplete: () => {
            sprite.play(`${ANIMATIONS.IDLE}_${prefix}`);
            if (onAnimationDone) onAnimationDone();
          },
        });
        break;

      case ANIMATIONS.VICTORY:
      case ANIMATIONS.DEATH:
        sprite.play(animationKey);
        if (action === ANIMATIONS.VICTORY) {
          sprite.scene.tweens.add({
            targets: sprite,
            y: sprite.y - 20,
            duration: 500,
            yoyo: true,
            repeat: -1,
          });
        }
        break;

      default:
        sprite.play(animationKey);
        break;
    }
  };

  useEffect(() => {
    if (!gameRef.current) {
      const sceneConfig = {
        key: "CombatScene",
        preload: function () {
          this.load.image("arena_bg", "/assets/arena_bg.png");
          ANIMATION_CONFIG.forEach((anim) => {
            ["brute", "opponent"].forEach((prefix) => {
              const key = `${prefix}_${anim.key}`;
              const file = `/assets/${anim.file}`;
              this.load.spritesheet(key, file, {
                frameWidth: SPRITE_CONFIG.frameWidth,
                frameHeight: SPRITE_CONFIG.frameHeight,
              });
            });
          });
        },
        create: function () {
          sceneRef.current = this;
          this.add.image(300, 150, "arena_bg").setDisplaySize(600, 300);

          ["brute", "opponent"].forEach((prefix) => {
            ANIMATION_CONFIG.forEach((anim) => {
              const animKey = `${anim.key}_${prefix}`;
              const spriteKey = `${prefix}_${anim.key}`;

              if (this.anims.exists(animKey)) {
                this.anims.remove(animKey);
              }

              this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(spriteKey, {
                  start: anim.frameConfig.startFrame,
                  end: anim.frameConfig.endFrame,
                }),
                frameRate: anim.frameRate,
                repeat: anim.repeat,
                yoyo: anim.key === ANIMATIONS.HURT,
                hideOnComplete: false,
              });
            });
          });

          this.bruteSprite = this.add
            .sprite(SPRITE_CONFIG.bruteX, SPRITE_CONFIG.y, "brute_idle")
            .setScale(SPRITE_CONFIG.scale)
            .setOrigin(0.5, 1)
            .setName("bruteSprite");

          this.opponentSprite = this.add
            .sprite(SPRITE_CONFIG.opponentX, SPRITE_CONFIG.y, "opponent_idle")
            .setScale(SPRITE_CONFIG.scale)
            .setFlipX(true)
            .setOrigin(0.5, 1)
            .setName("opponentSprite");

          this.bruteSprite.anims.play(`${ANIMATIONS.IDLE}_brute`, true);
          this.opponentSprite.anims.play(`${ANIMATIONS.IDLE}_opponent`, true);

          this.physics.world.enable([this.bruteSprite, this.opponentSprite]);
          this.bruteSprite.body.setCollideWorldBounds(true);
          this.opponentSprite.body.setCollideWorldBounds(true);

          if (typeof onSceneReady === "function") {
            onSceneReady();
          }
        },
      };

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 300,
        parent: phaserRef.current,
        scene: sceneConfig,
        backgroundColor: "#000000",
        pixelArt: true,
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("[CombatPhaser] bruteAction reçu:", bruteAction);
    if (sceneRef.current && bruteAction) {
      handleAnimation(sceneRef.current.bruteSprite, bruteAction, false);
    }
  }, [bruteAction]);

  useEffect(() => {
    console.log("[CombatPhaser] opponentAction reçu:", opponentAction);
    if (sceneRef.current && opponentAction) {
      handleAnimation(sceneRef.current.opponentSprite, opponentAction, true);
    }
  }, [opponentAction]);

  return <div ref={phaserRef} />;
}
