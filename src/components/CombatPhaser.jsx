import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function CombatPhaser({ brute, opponent, action }) {
  const phaserRef = useRef(null);

  useEffect(() => {
    let game;
    let bruteSprite;
    let sceneConfig = {
      key: "CombatScene",
      preload,
      create,
      update,
    };

    function preload() {
      // Charge le background arène
      this.load.image("arena_bg", "/assets/arena_bg.png");
      // Charge les spritesheets brute
      this.load.spritesheet("brute_idle", "/assets/Biker_idle.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
      this.load.spritesheet(
        "brute_run_attack",
        "/assets/Biker_run_attack.png",
        { frameWidth: 48, frameHeight: 48 }
      );
      this.load.spritesheet("brute_hurt", "/assets/Biker_hurt.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
      this.load.spritesheet("brute_death", "/assets/Biker_death.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
      this.load.spritesheet("brute_climb", "/assets/Biker_climb.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
      // Opposant : utilise idle pour l'instant
      this.load.spritesheet("opponent_idle", "/assets/Biker_idle.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
    }

    function create() {
      // Affiche le background arène
      this.add.image(300, 150, "arena_bg").setDisplaySize(600, 300);
      // Animations brute
      this.anims.create({
        key: "idle_brute",
        frames: this.anims.generateFrameNumbers("brute_idle", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: "attack_brute",
        frames: this.anims.generateFrameNumbers("brute_run_attack", {
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "hurt_brute",
        frames: this.anims.generateFrameNumbers("brute_hurt", {
          start: 0,
          end: 1,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.anims.create({
        key: "death_brute",
        frames: this.anims.generateFrameNumbers("brute_death", {
          start: 0,
          end: 5,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.anims.create({
        key: "climb_brute",
        frames: this.anims.generateFrameNumbers("brute_climb", {
          start: 0,
          end: 5,
        }),
        frameRate: 6,
        repeat: 0,
      });
      // Sprite brute
      bruteSprite = this.add.sprite(150, 200, "brute_idle").setScale(4);
      bruteSprite.play("idle_brute");
      // Opposant
      this.anims.create({
        key: "idle_opponent",
        frames: this.anims.generateFrameNumbers("opponent_idle", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
      const opponentSprite = this.add
        .sprite(450, 200, "opponent_idle")
        .setScale(4);
      opponentSprite.setFlipX(true);
      opponentSprite.play("idle_opponent");
      // Animation selon action
      if (action === "attack") {
        bruteSprite.play("attack_brute");
        bruteSprite.on("animationcomplete", () =>
          bruteSprite.play("idle_brute")
        );
      } else if (action === "hurt") {
        bruteSprite.play("hurt_brute");
        bruteSprite.on("animationcomplete", () =>
          bruteSprite.play("idle_brute")
        );
      } else if (action === "death") {
        bruteSprite.play("death_brute");
      } else if (action === "win") {
        bruteSprite.play("climb_brute");
      }
    }

    function update() {}

    game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 600,
      height: 300,
      parent: phaserRef.current,
      scene: sceneConfig,
      physics: { default: "arcade" },
    });

    return () => {
      if (game) game.destroy(true);
    };
  }, [brute, opponent, action]);

  return <div ref={phaserRef} />;
}
