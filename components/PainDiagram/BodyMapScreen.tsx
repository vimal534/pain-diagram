import React, { useState } from 'react';
import { BodyRegion, SelectedRegion } from '../../types/pain';
import { font, SEVERITY_COLORS } from './tokens';
import StatusBar from './StatusBar';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bodyFill: '#D1D5DB',   // unselected
  hover:    '#8CC4FF',   // hover
  selected: '#2F80ED',   // selected
  stroke:   '#FFFFFF',
  strokeW:  3,
  bg:       '#FFFFFF',
  text:     '#111827',
  sub:      '#6B7280',
  primary:  '#2F80ED',
  border:   '#E5E7EB',
  chipDot:    (s?: string | null) => s ? SEVERITY_COLORS[s]?.dot    ?? '#2F80ED' : '#2F80ED',
  chipBg:     (s?: string | null) => s ? SEVERITY_COLORS[s]?.bg     ?? '#EFF6FF' : '#EFF6FF',
  chipBorder: (s?: string | null) => s ? SEVERITY_COLORS[s]?.border ?? '#2F80ED' : '#2F80ED',
};

// ─── SVG viewBox 0 0 1023 1537 ───────────────────────────────────────────────
// Paths extracted from body pain.svg (Adobe Illustrator).
// Anatomical convention: viewer's LEFT = left on screen, viewer's RIGHT = right.
export const BODY_REGIONS: BodyRegion[] = [
  // HEAD (main oval + right ear + left ear as compound path)
  {
    id: 'head', label: 'Head', side: 'center', anatomyGroup: 'head',
    tooltipX: 510, tooltipY: 48,
    svgPath: 'M 502.8,73.3 c 37.9-4.3,65.8,18.4,69.3,56.2,2.2,23.6-5.1,68.3-15.3,89.7-22,46-76.2,41.3-94.7-4.7-18.9-46.9-28.1-133.5,40.8-141.2Z M 580.7,163.3 c 6.8,6.1-2.1,28.8-6.9,35.1s-4.1,5-7.8,4.7l7.2-38.3 c.9-3.2,5.3-3.5,7.5-1.5Z M 455,203 c -6.1,.7-8.4-4.1-10.7-8.8s-11.9-29-1.6-32 c7.3-2.2,4.7,4.9,5.4,9.2,1.7,10.6,4.3,21.2,6.9,31.6Z',
  },
  // NECK
  {
    id: 'neck', label: 'Neck', side: 'center', anatomyGroup: 'neck',
    tooltipX: 511, tooltipY: 248,
    svgPath: 'M 555,262.5 c 1.6,16.4,14.9,27.2,28.3,34.7,4.4,2.5,14.1,5.6,17.1,7.9,4.2,3.3-3.9,14.8-6.6,18.2-7.7,10-14.3,12.4-26.1,15.9-34.9,10.5-67.3,11-102.8,3.2-10.3-2.3-26.9-5.5-34-13-6.3-6.6-9.4-14.8-13-23,17.2-8.9,44.4-20,46.9-42.1s.4-22.8,1.1-33.4 c17.3,21.1,42.6,32.6,68.3,17.8s14.3-11.9,20.7-18.8 c.7,10.5-1,22.2,0,32.5Z',
  },
  // CHEST (upper torso)
  {
    id: 'chest', label: 'Chest', side: 'center', anatomyGroup: 'chest',
    tooltipX: 511, tooltipY: 458,
    svgPath: 'M 623.8,532.8 c -4.1,1.6-8.1,3.8-12.3,5.2-37.2,12.1-75.7,.4-114.1,1.9-18,.7-36,4.7-54,4.1-16,-.6-33.9-4.1-48-12-1.5-22.6-12.9-46.9-11.5-69.5s20.5-50.1,33.2-73.8 c8.3-15.6,15.3-31.7,21-48.5,12.6,2,24.9,6.4,37.7,8.5,30.7,5.2,53.9,3.4,84-3.4,5.1-1.1,20.4-7.7,23.7-3.3s4.4,15,5.7,18.3 c12.6,32.4,45.2,70.6,46.8,103.2,1.1,21.9-11.3,47.2-12.1,69.3Z',
  },
  // ABDOMEN
  {
    id: 'abdomen', label: 'Abdomen', side: 'center', anatomyGroup: 'abdomen',
    tooltipX: 511, tooltipY: 547,
    svgPath: 'M 622,538 c .2,15.7-5.1,30.9-6,46.5-1.6,27.6,5.2,55.2,7.9,82.4-48.6,18.4-100.3,26.8-152.3,19.9s-52.2-11.6-77.6-19.9 c3.6-29.3,8.7-57.7,7-87.5-.3-5.7-5.9-39.5-4-41.5,15,5.4,30.4,9.4,46.4,10,18.3,.7,36.7-3.4,55-4.1,41.7-1.5,83.8,12.3,123.5-5.9Z',
  },
  // PELVIS / HIP
  {
    id: 'pelvis', label: 'Pelvis', side: 'center', anatomyGroup: 'pelvis',
    tooltipX: 511, tooltipY: 658,
    svgPath: 'M 625,671 c 6.4,30.1,14.1,60.2,16.5,91.1-2.7,7.2-51.7,29-61.5,34.4-4.4,2.4-9,5.1-13.3,7.7-12.7,7.8-35.1,28.2-46.5,32.5s-15.5,2.9-21.1,.7 c-20.9-15-41.3-30.7-64-43-15.1-8.2-33.4-14.5-47.7-23.3-2.6-1.6-10.3-7.2-11.1-9.9-1.5-4.9,2.9-25.1,4.1-31.5,3.5-19.4,8.3-38.6,12.8-57.7,2.3,-.5,4.6,-.1,6.9,.3,10.3,2.1,23.4,8.4,34.7,11.3,52.6,13.1,104.2,12.5,156.4-2,11.4-3.2,22.3-7.7,33.8-10.7Z',
  },
  // RIGHT SHOULDER (viewer's right)
  {
    id: 'r-shoulder', label: 'Right Shoulder', side: 'right', anatomyGroup: 'shoulder',
    tooltipX: 660, tooltipY: 295,
    svgPath: 'M 609.7,307.2 c 30.3,3.8,63.9,1.8,85.2,27.4,22.5,26.9,23.9,69.4,22,103s-.3,7.4-1.5,7.4 c-18.8-7.7-43.1,-.8-59,11s-8.4,8.3-12.5,11.5-1.2,2.3-2.5,.5-2.9-15.8-4-20 c-7.4-29.3-33.5-60.2-45.3-90.7-1.6-4.3-7.3-17.8-5.7-21.2s7.8-7.4,9.9-10.1 c3.9-5,7.9-17.7,13.3-18.8Z',
  },
  // LEFT SHOULDER (viewer's left)
  {
    id: 'l-shoulder', label: 'Left Shoulder', side: 'left', anatomyGroup: 'shoulder',
    tooltipX: 362, tooltipY: 295,
    svgPath: 'M 380,470 c -.9,1-11-8.8-12.5-10-18.7-13.9-41.7-18.2-64.5-13-1.5-28.7-2.7-57.9,8.5-85,16.3-39.5,40.1-45.1,78.9-50.1,4.7,-.6,19-4.3,22.1-3.9s7.9,13.7,11.1,17.9,11.6,10,11.3,13.3 c-6.3,17.4-13.9,34.2-22.7,50.4-13.7,25.5-34,49.3-32.2,80.3Z',
  },
  // RIGHT UPPER ARM
  {
    id: 'r-upperarm', label: 'Right Upper Arm', side: 'right', anatomyGroup: 'upperarm',
    tooltipX: 703, tooltipY: 465,
    svgPath: 'M 688.8,446.3 c 5.7,-.7,26.6-1.5,29,4.5,9.4,40.3,14.5,81.6,25,121.7-1.6,8.2-51.6,29.2-61.8,24.2-12.6-40.3-28.8-79.7-38.6-121.1,9.9-14.1,29.1-27.1,46.4-29.2Z',
  },
  // LEFT UPPER ARM
  {
    id: 'l-upperarm', label: 'Left Upper Arm', side: 'left', anatomyGroup: 'upperarm',
    tooltipX: 320, tooltipY: 465,
    svgPath: 'M 341.8,595.8 c -2.9,4.1-26.3-2.3-31.1-4-5.4-1.9-30.6-14.5-31.5-19.4,9.3-35.9,10.9-74.5,20.4-110.2s.5-9.9,8.1-11.9 c23.6-6.2,56,5.4,70,25.4l-36,120.1Z',
  },
  // RIGHT FOREARM
  {
    id: 'r-forearm', label: 'Right Forearm', side: 'right', anatomyGroup: 'forearm',
    tooltipX: 733, tooltipY: 665,
    svgPath: 'M 748,778 c -17.9-60.8-61.8-112-66-177,22.2,-.4,44.4-10.2,61.5-24,29.5,56.5,23,124,47.4,182.5l-42.9,18.5Z',
  },
  // LEFT FOREARM
  {
    id: 'l-forearm', label: 'Left Forearm', side: 'left', anatomyGroup: 'forearm',
    tooltipX: 289, tooltipY: 665,
    svgPath: 'M 340,601 c -.6,65.5-44.9,117.3-65,177l-42-17.5-.8-2.7 c18.5-47.9,16.5-102.2,32.8-150.3s8.7-20.1,12-30.5l14.7,9.8 c14.8,8.3,31,14.5,48.3,14.2Z',
  },
  // RIGHT HAND
  {
    id: 'r-hand', label: 'Right Hand', side: 'right', anatomyGroup: 'hand',
    tooltipX: 800, tooltipY: 810,
    svgPath: 'M 817,820 l 15.9,66.4 c -.6,6.9-6.2,8.8-11.4,4.5l-14.5-40.9 c.1,11.2,14.3,45.9,8.9,54.4s-10.6,1.8-12.4-3.4l-11.5-48 c-1.7,-.3-1,2.3,-.9,3.4,1.2,8.2,10.9,39.5,8.4,44.6s-10.5,1.2-12.7-3.3 c-6.3-12.9-5.8-34.3-12.3-47.7-.7,6.3,2.1,12.6,3.2,18.8s2.6,12.8,2.2,15.4 c-1,6.1-9.3,6.6-11.6,1-2.7-21.4-10.8-41.5-15.9-62.1-3.5-14-4.8-26.1-3.3-40.5,13.4-8.1,28.7-11.8,42.8-18.5l2.2,.3 c8.4,10.3,23.3,18.6,31,29,4.5,6,7.2,15.9,11.2,22.8,2.2,3.8,13.3,17,13.6,18.4,.5,2.1-1.1,4.6-3.1,5.5-12.3,5.7-22.4-13.6-29.8-20.3Z',
  },
  // LEFT HAND
  {
    id: 'l-hand', label: 'Left Hand', side: 'left', anatomyGroup: 'hand',
    tooltipX: 213, tooltipY: 810,
    svgPath: 'M 248,850 c -2.7,-.5-1.7,.5-2.3,2.2-3.4,10.8-7.2,38.9-12.9,46.2s-11.6,6-11.9,-.8l9.8-42.3-.7-3.2-12.2,48.3 c-1.3,5.5-10.1,9.9-13.1,3.5-4.6-9.9,10.1-44.5,10.3-56.8l-14.2,41.3 c-3.4,5.9-11,7.3-11.8,-.8s8.7-41.5,11.5-52.5,4.5-8.7,3.5-14 c-2,-.5-1.9,.8-2.8,1.7-6.7,6.5-14.5,20.6-26.5,17.1-8.4-2.5,-.9-8.5,1.3-11.3,9.5-12.3,14.6-24.4,22-38l30.7-26.4h2.5 c13.9,6.8,29.6,9.6,42.2,18.8,.6,9.6,.7,18.7,-.7,28.3s-7.9,25.6-11.4,38.6-6,33.2-9.3,36.7-9.2,3.5-10-1 c-1.7-9.2,4.7-25.9,6-35.5Z',
  },
  // RIGHT THIGH
  {
    id: 'r-thigh', label: 'Right Thigh', side: 'right', anatomyGroup: 'thigh',
    tooltipX: 604, tooltipY: 865,
    svgPath: 'M 643,767 l 7,68.5 c 5.4,53.8-11.1,104.2-19.7,156.3-1.9,11.3-2.3,22.9-4.3,34.2-24.4-15.7-59.1-12.9-81.5,5l-1.4-2.5 c-6.4-55-25.1-111.6-27-167-.3-8.5,1-16.4,7.5-22.5s29.3-21.4,39.2-27.8 c21.5-14,45.2-24.3,68-36l12.3-8.2Z',
  },
  // LEFT THIGH
  {
    id: 'l-thigh', label: 'Left Thigh', side: 'left', anatomyGroup: 'thigh',
    tooltipX: 424, tooltipY: 865,
    svgPath: 'M 377,767 c .1,.1,.2,1.8,1.6,2.9,14,10.8,37.2,18.9,53.4,27.6,23.2,12.5,44.4,27.9,65.5,43.5,3.2,5.2,3.7,11.5,3.5,17.6-.3,10.6-1.9,24.2-3.2,34.8-5.6,46-19.8,90.6-24.9,136.6-6.5-2.8-12.1-7.2-18.7-9.8-19.2-7.4-46.1-6.4-63.3,5.8-3-44.2-17.2-86.6-22-130.5-4.7-43.2,-.8-85.3,6-127.9-.2,-.9,1.8,-.6,2,-.5Z',
  },
  // RIGHT CALF / LOWER LEG
  {
    id: 'r-calf', label: 'Right Calf', side: 'right', anatomyGroup: 'calf',
    tooltipX: 582, tooltipY: 1145,
    svgPath: 'M 625.8,1030.2 c 1.1,12.8,-.8,26.6,.2,39.3s6.5,30.1,8,45 c6.3,62.6-22.4,122.3-17.9,184.9-.1,.6-5.4,1.5-6.6,1.6-8.2,.7-24.9,1.1-32.7,-.2-6.8-1.1-3.4-5.9-3.8-12.2-1.5-26-3.9-51.9-9.7-77.3s-13.8-43.2-15.3-64.7,2.2-37,3-56 c.8-17.9-5.9-37.6-8-55.4,5.3-1.6,9.5-5.9,14.3-8.2,20.8-10.1,49.1-9.7,68.5,3.4Z',
  },
  // LEFT CALF / LOWER LEG
  {
    id: 'l-calf', label: 'Left Calf', side: 'left', anatomyGroup: 'calf',
    tooltipX: 438, tooltipY: 1145,
    svgPath: 'M 397,1300 c .1-18.1,-.2-36.4-2-54.5-4.3-41.5-16.8-81.8-14-124s7.7-32.7,9-48-1.6-29.2,.9-43.1 c23.5-16.9,59.9-13.6,81.7,5-3.7,20.6-8.7,39.8-7.7,61.1s4,40.2,.8,60.9 c-2.5,16.2-9.7,32.3-13.8,48.2-7.3,28.2-10.1,57-12.1,85.9-.1,1.8,.8,7.3,.6,7.6-2.5,3.8-37.3,1.5-43.6,.9Z',
  },
  // RIGHT FOOT
  {
    id: 'r-foot', label: 'Right Foot', side: 'right', anatomyGroup: 'foot',
    tooltipX: 592, tooltipY: 1310,
    svgPath: 'M 617,1304 c -.6,16.4,4.5,26.9,11.8,40.7s15.9,28.3,28.2,39.8 c3.5,3.3,8.3,5.4,11.5,9.5,4.5,5.8,7,16.7,1.4,22.5-9.9,10.2-34,15.6-47.8,12.9-6.1-1.2-17.4-7.8-22.1-11.9-7.3-6.4-7.5-16.4-13.7-24.3-6.5-8.4-18.4-11.5-21.1-21.9-4.3-16.2,3.1-23.1,4.6-36.8,.7-6.2,-.3-12.7,0-18.9s1.2-10,1.5-10.5 c1.2-1.9,39.6,2.1,45.6,-.9Z',
  },
  // LEFT FOOT
  {
    id: 'l-foot', label: 'Left Foot', side: 'left', anatomyGroup: 'foot',
    tooltipX: 443, tooltipY: 1310,
    svgPath: 'M 441,1304 c 2.3,9.2,0,19,1.1,28.4,1.6,14.7,10.5,22.1,5.7,39.9-2.5,9.2-14.2,13-20.2,20.8-5.3,7-5.8,15.1-10.6,21.4s-19.4,15.1-29.4,15.6-30.9-4.2-41.1-13 c-16.9-14.7,14.2-35.4,22.5-45.5s22.3-36,25-46s.1-14.2,2.1-21.4 c15,1.7,29.9,2.1,44.9,0Z',
  },
];

// ─── Back body regions (from back_body_pain_diagram_dark.svg) ─────────────────
export const BACK_BODY_REGIONS: BodyRegion[] = [
  // HEAD (back)
  {
    id: 'back-head', label: 'Head', side: 'center', anatomyGroup: 'head',
    tooltipX: 511, tooltipY: 55,
    svgPath: 'M 485 73 L 470 82 L 460 92 L 453 104 L 449 117 L 447 133 L 449 161 L 448 162 L 446 159 L 442 159 L 437 165 L 437 175 L 443 191 L 451 201 L 455 201 L 448 170 L 449 161 L 453 183 L 458 199 L 459 218 L 465 236 L 488 227 L 508 224 L 532 226 L 558 236 L 564 219 L 564 201 L 574 160 L 574 173 L 567 201 L 571 201 L 576 197 L 586 175 L 585 163 L 581 159 L 575 161 L 574 160 L 575 123 L 570 104 L 563 92 L 552 81 L 536 72 L 519 68 L 505 68 Z',
  },
  // UPPER BACK (neck + upper back + shoulders combined)
  {
    id: 'upper-back', label: 'Upper Back', side: 'center', anatomyGroup: 'upperback',
    tooltipX: 511, tooltipY: 310,
    svgPath: 'M 465 241 L 464 257 L 459 270 L 447 282 L 420 297 L 432 315 L 432 338 L 417 372 L 387 419 L 376 445 L 374 473 L 384 507 L 391 543 L 414 550 L 430 552 L 462 552 L 493 548 L 592 552 L 612 549 L 629 543 L 635 513 L 648 472 L 648 455 L 641 431 L 605 370 L 592 339 L 591 318 L 594 310 L 604 297 L 582 286 L 567 273 L 560 259 L 558 241 L 545 234 L 525 229 L 497 229 Z',
  },
  // MID BACK
  {
    id: 'mid-back', label: 'Mid Back', side: 'center', anatomyGroup: 'midback',
    tooltipX: 511, tooltipY: 590,
    svgPath: 'M 628 547 L 610 553 L 588 556 L 563 556 L 515 551 L 489 552 L 458 556 L 433 556 L 416 554 L 392 548 L 399 597 L 398 628 L 393 667 L 427 673 L 482 686 L 500 688 L 538 686 L 589 674 L 625 668 L 626 658 L 621 623 L 621 591 Z',
  },
  // LOWER BACK
  {
    id: 'lower-back', label: 'Lower Back', side: 'center', anatomyGroup: 'lowerback',
    tooltipX: 511, tooltipY: 720,
    svgPath: 'M 392 673 L 377 756 L 374 786 L 383 801 L 400 819 L 422 833 L 435 838 L 458 842 L 482 841 L 507 834 L 514 834 L 528 839 L 549 842 L 577 840 L 598 833 L 616 822 L 634 804 L 646 785 L 638 728 L 627 672 L 607 674 L 557 686 L 527 691 L 485 690 L 408 673 Z',
  },
  // LEFT SHOULDER (back view, left of screen)
  {
    id: 'l-shoulder-back', label: 'Left Shoulder', side: 'left', anatomyGroup: 'shoulder',
    tooltipX: 355, tooltipY: 330,
    svgPath: 'M 417 300 L 412 299 L 394 304 L 380 305 L 379 306 L 369 306 L 368 307 L 353 309 L 334 317 L 324 324 L 317 331 L 308 343 L 300 359 L 294 378 L 293 389 L 292 390 L 292 402 L 291 403 L 292 449 L 302 445 L 311 443 L 332 443 L 343 446 L 355 452 L 370 466 L 371 451 L 378 429 L 391 405 L 416 366 L 423 352 L 428 338 L 430 329 L 429 318 L 426 311 Z',
  },
  // RIGHT SHOULDER (back view, right of screen)
  {
    id: 'r-shoulder-back', label: 'Right Shoulder', side: 'right', anatomyGroup: 'shoulder',
    tooltipX: 665, tooltipY: 330,
    svgPath: 'M 608 299 L 599 309 L 595 318 L 594 330 L 600 351 L 611 373 L 631 404 L 642 424 L 650 447 L 652 466 L 663 455 L 679 446 L 690 443 L 710 443 L 719 445 L 728 449 L 728 422 L 729 421 L 729 388 L 728 387 L 728 380 L 721 355 L 709 334 L 697 322 L 679 312 L 665 308 L 634 305 L 616 301 L 612 299 Z',
  },
  // LEFT UPPER ARM (back)
  {
    id: 'l-upperarm-back', label: 'Left Upper Arm', side: 'left', anatomyGroup: 'upperarm',
    tooltipX: 310, tooltipY: 525,
    svgPath: 'M 310 447 L 292 453 L 291 461 L 290 462 L 290 467 L 288 473 L 288 478 L 286 484 L 286 489 L 284 495 L 284 500 L 282 506 L 282 511 L 280 517 L 280 522 L 278 528 L 278 533 L 277 534 L 275 547 L 274 548 L 274 551 L 273 552 L 273 555 L 272 556 L 272 559 L 271 560 L 271 563 L 269 567 L 268 573 L 273 578 L 285 586 L 291 588 L 296 591 L 305 594 L 308 594 L 309 595 L 313 595 L 314 596 L 334 597 L 336 593 L 336 590 L 337 589 L 337 586 L 338 585 L 338 582 L 339 581 L 341 572 L 343 569 L 344 564 L 353 543 L 364 510 L 365 503 L 367 499 L 367 496 L 370 487 L 371 475 L 367 468 L 356 457 L 343 450 L 337 448 L 333 448 L 332 447 L 326 447 L 325 446 Z',
  },
  // RIGHT UPPER ARM (back)
  {
    id: 'r-upperarm-back', label: 'Right Upper Arm', side: 'right', anatomyGroup: 'upperarm',
    tooltipX: 710, tooltipY: 525,
    svgPath: 'M 712 447 L 696 446 L 695 447 L 689 447 L 688 448 L 685 448 L 676 451 L 666 457 L 654 469 L 650 476 L 651 478 L 652 488 L 653 489 L 653 493 L 654 494 L 659 517 L 661 521 L 661 524 L 666 539 L 668 542 L 669 547 L 671 550 L 676 565 L 678 568 L 683 583 L 684 591 L 686 597 L 700 597 L 701 596 L 706 596 L 707 595 L 711 595 L 712 594 L 719 593 L 722 591 L 729 589 L 740 583 L 752 573 L 751 567 L 748 559 L 748 556 L 747 555 L 747 552 L 746 551 L 746 548 L 745 547 L 745 543 L 744 542 L 744 538 L 743 537 L 743 533 L 742 532 L 742 528 L 740 522 L 740 517 L 738 511 L 736 494 L 735 493 L 734 483 L 733 482 L 733 478 L 731 472 L 731 467 L 730 466 L 730 461 L 729 460 L 729 454 L 725 451 L 723 451 L 720 449 L 713 448 Z',
  },
  // LEFT FOREARM (back)
  {
    id: 'l-forearm-back', label: 'Left Forearm', side: 'left', anatomyGroup: 'forearm',
    tooltipX: 270, tooltipY: 680,
    svgPath: 'M 266 577 L 260 591 L 250 621 L 241 667 L 240 681 L 239 682 L 235 712 L 229 737 L 221 761 L 221 764 L 225 767 L 265 784 L 285 737 L 311 686 L 318 669 L 329 633 L 334 604 L 334 600 L 316 600 L 302 597 L 291 593 L 280 587 Z',
  },
  // RIGHT FOREARM (back)
  {
    id: 'r-forearm-back', label: 'Right Forearm', side: 'right', anatomyGroup: 'forearm',
    tooltipX: 755, tooltipY: 680,
    svgPath: 'M 752 578 L 740 587 L 724 595 L 703 600 L 686 600 L 693 640 L 704 673 L 734 735 L 750 771 L 752 778 L 755 784 L 770 777 L 786 771 L 798 765 L 799 763 L 793 746 L 785 715 L 777 657 L 769 618 L 759 589 L 754 578 Z',
  },
  // LEFT HAND (back)
  {
    id: 'l-hand-back', label: 'Left Hand', side: 'left', anatomyGroup: 'hand',
    tooltipX: 210, tooltipY: 835,
    svgPath: 'M 221 768 L 218 768 L 186 797 L 174 824 L 162 841 L 162 845 L 165 848 L 173 848 L 178 845 L 189 833 L 190 834 L 181 867 L 177 888 L 177 898 L 181 902 L 186 902 L 191 897 L 196 874 L 200 863 L 201 868 L 196 890 L 194 908 L 195 914 L 199 918 L 205 917 L 209 911 L 211 894 L 214 884 L 215 889 L 212 901 L 212 910 L 213 912 L 219 914 L 225 909 L 228 901 L 234 869 L 235 875 L 233 895 L 237 899 L 242 899 L 245 896 L 247 890 L 251 858 L 260 833 L 263 820 L 264 788 L 225 771 Z',
  },
  // RIGHT HAND (back)
  {
    id: 'r-hand-back', label: 'Right Hand', side: 'right', anatomyGroup: 'hand',
    tooltipX: 815, tooltipY: 835,
    svgPath: 'M 799 768 L 756 787 L 756 817 L 761 838 L 768 857 L 772 882 L 772 891 L 774 896 L 778 899 L 782 899 L 785 896 L 786 875 L 793 909 L 799 914 L 802 914 L 806 911 L 807 905 L 804 891 L 805 885 L 810 912 L 813 917 L 819 918 L 823 915 L 824 912 L 823 894 L 818 870 L 819 864 L 829 900 L 835 903 L 838 902 L 841 898 L 841 887 L 838 870 L 829 834 L 830 833 L 842 846 L 846 848 L 854 848 L 857 845 L 857 841 L 845 824 L 833 797 L 805 771 Z',
  },
  // LEFT THIGH (back)
  {
    id: 'l-thigh-back', label: 'Left Thigh', side: 'left', anatomyGroup: 'thigh',
    tooltipX: 420, tooltipY: 910,
    svgPath: 'M 372 792 L 366 848 L 366 892 L 374 943 L 389 1003 L 391 1033 L 393 1034 L 410 1027 L 429 1025 L 448 1028 L 461 1034 L 471 1041 L 478 996 L 500 903 L 505 863 L 505 840 L 502 839 L 486 844 L 466 846 L 450 845 L 432 841 L 412 832 L 399 823 L 384 808 L 374 792 Z',
  },
  // RIGHT THIGH (back)
  {
    id: 'r-thigh-back', label: 'Right Thigh', side: 'right', anatomyGroup: 'thigh',
    tooltipX: 590, tooltipY: 910,
    svgPath: 'M 647 792 L 637 806 L 624 820 L 609 831 L 593 839 L 571 845 L 557 846 L 540 845 L 516 839 L 516 865 L 521 903 L 541 990 L 549 1041 L 563 1032 L 582 1026 L 605 1026 L 628 1034 L 631 999 L 646 939 L 653 892 L 653 847 Z',
  },
  // LEFT CALF (back)
  {
    id: 'l-calf-back', label: 'Left Calf', side: 'left', anatomyGroup: 'calf',
    tooltipX: 420, tooltipY: 1175,
    svgPath: 'M 434 1029 L 409 1031 L 392 1038 L 391 1040 L 389 1074 L 379 1118 L 375 1152 L 378 1195 L 392 1270 L 394 1292 L 394 1319 L 414 1322 L 439 1319 L 439 1296 L 442 1271 L 450 1236 L 465 1187 L 468 1163 L 467 1132 L 464 1114 L 464 1086 L 471 1046 L 467 1042 L 453 1034 Z',
  },
  // RIGHT CALF (back)
  {
    id: 'r-calf-back', label: 'Right Calf', side: 'right', anatomyGroup: 'calf',
    tooltipX: 595, tooltipY: 1175,
    svgPath: 'M 586 1029 L 567 1034 L 556 1040 L 549 1046 L 556 1089 L 556 1111 L 552 1143 L 552 1166 L 555 1188 L 569 1235 L 576 1266 L 579 1289 L 580 1319 L 587 1321 L 605 1322 L 621 1320 L 625 1318 L 624 1298 L 626 1275 L 640 1205 L 644 1176 L 644 1139 L 632 1079 L 628 1038 L 607 1030 Z',
  },
  // LEFT FOOT (back)
  {
    id: 'l-foot-back', label: 'Left Foot', side: 'left', anatomyGroup: 'foot',
    tooltipX: 400, tooltipY: 1370,
    svgPath: 'M 439 1324 L 412 1326 L 411 1325 L 402 1325 L 401 1324 L 394 1323 L 393 1326 L 393 1335 L 392 1336 L 392 1348 L 391 1349 L 391 1364 L 387 1376 L 367 1418 L 359 1426 L 354 1429 L 350 1433 L 346 1441 L 346 1449 L 347 1452 L 350 1456 L 353 1458 L 355 1458 L 360 1463 L 364 1465 L 371 1465 L 376 1468 L 407 1469 L 418 1465 L 427 1457 L 430 1449 L 430 1433 L 431 1432 L 432 1426 L 435 1420 L 445 1409 L 448 1401 L 448 1382 L 447 1381 L 446 1374 L 442 1365 L 442 1360 L 441 1359 L 441 1340 L 440 1339 L 440 1334 L 439 1333 Z',
  },
  // RIGHT FOOT (back)
  {
    id: 'r-foot-back', label: 'Right Foot', side: 'right', anatomyGroup: 'foot',
    tooltipX: 625, tooltipY: 1370,
    svgPath: 'M 580 1324 L 579 1327 L 579 1333 L 577 1339 L 576 1364 L 571 1377 L 570 1390 L 569 1392 L 570 1393 L 570 1401 L 575 1411 L 581 1417 L 586 1426 L 588 1432 L 588 1448 L 591 1456 L 598 1463 L 608 1468 L 611 1468 L 612 1469 L 637 1469 L 638 1468 L 642 1468 L 647 1465 L 654 1465 L 660 1462 L 663 1458 L 665 1458 L 668 1456 L 671 1452 L 672 1449 L 672 1441 L 670 1435 L 663 1428 L 657 1424 L 649 1414 L 646 1408 L 646 1406 L 641 1397 L 639 1390 L 634 1381 L 634 1379 L 632 1376 L 632 1374 L 628 1365 L 628 1355 L 627 1354 L 627 1346 L 626 1345 L 626 1338 L 625 1337 L 625 1324 L 624 1323 L 616 1324 L 615 1325 L 587 1325 L 586 1324 Z',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  selectedRegions: SelectedRegion[];
  successToast: string | null;
  onRegionTap: (r: BodyRegion) => void;
  onRemoveRegion: (id: string) => void;
  onClearAll: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function BodyMapScreen({
  selectedRegions, successToast,
  onRegionTap, onRemoveRegion, onClearAll, onContinue, onBack,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');
  const selectedIds = selectedRegions.map(s => s.region.id);
  const count = selectedRegions.length;
  const activeRegions = view === 'front' ? BODY_REGIONS : BACK_BODY_REGIONS;
  const hoveredRegion = activeRegions.find(r => r.id === hoveredId) ?? null;

  const regionFill = (r: BodyRegion): string => {
    if (selectedIds.includes(r.id)) return C.selected;
    if (hoveredId === r.id) return C.hover;
    return C.bodyFill;
  };

  // Tooltip sizing in SVG coordinate space (viewBox 0 0 1023 1537)
  const tooltipW = (label: string) => Math.max(300, label.length * 33 + 80);

  return (
    <div style={{ backgroundColor: C.bg, display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font.heading, position: 'relative' }}>
      <StatusBar />

      {/* Success toast */}
      <div style={{
        position: 'absolute', top: 58, left: 20, right: 20, zIndex: 50,
        backgroundColor: '#1A1A2E', color: '#FFF', borderRadius: 14,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        transform: successToast ? 'translateY(0)' : 'translateY(-80px)',
        opacity: successToast ? 1 : 0,
        transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s',
        pointerEvents: 'none',
      }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</span>
        <span style={{ fontFamily: font.body, fontSize: 13, fontWeight: 500 }}>{successToast}</span>
      </div>

      {/* Header */}
      <div style={{ padding: '4px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8L8 15" stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.3px' }}>Where does it hurt?</h1>
      </div>

      {/* Info banner */}
      <div style={{
        margin: '0 16px 8px', padding: '10px 14px', borderRadius: 12, flexShrink: 0,
        backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#FFF', fontSize: 11, fontWeight: 800 }}>i</span>
        </div>
        <p style={{ margin: 0, fontFamily: font.body, fontSize: 13, color: '#1E40AF', fontWeight: 500 }}>
          Tap on the body to select one or more areas.
        </p>
      </div>

      {/* Body card */}
      <div style={{
        flex: 1, margin: '0 12px', borderRadius: 20,
        backgroundColor: '#F8F9FB', border: '1px solid #E5E7EB',
        display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
      }}>
        {/* LEFT / RIGHT labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px 0', flexShrink: 0 }}>
          <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px' }}>LEFT</span>
          <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px' }}>RIGHT</span>
        </div>

        {/* SVG body — viewBox tuned per view so both figures render at identical visual height */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0 0', minHeight: 0, overflow: 'hidden' }}>
          <svg
            viewBox={view === 'front' ? '10 -3 1004 1509' : '-7 -11 1037 1558'}
            style={{ height: '100%', width: 'auto', maxWidth: '100%', display: 'block' }}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Region paths — front or back depending on toggle */}
            {(view === 'front' ? BODY_REGIONS : BACK_BODY_REGIONS).map(r => (
              <path
                key={r.id}
                d={r.svgPath}
                fill={regionFill(r)}
                stroke={C.stroke}
                strokeWidth={C.strokeW}
                strokeLinejoin="round"
                style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onRegionTap(r)}
              />
            ))}

            {/* Severity dots — only for regions visible in current view */}
            {selectedRegions
              .filter(sr => (view === 'front' ? BODY_REGIONS : BACK_BODY_REGIONS).some(r => r.id === sr.region.id))
              .map(sr => {
                const lvl = sr.painLevel ? SEVERITY_COLORS[sr.painLevel] : null;
                return (
                  <g key={`dot-${sr.region.id}`} pointerEvents="none">
                    <circle cx={sr.region.tooltipX} cy={sr.region.tooltipY} r={22} fill="#FFF" opacity={0.9} />
                    <circle cx={sr.region.tooltipX} cy={sr.region.tooltipY} r={16} fill={lvl?.dot ?? C.selected} />
                  </g>
                );
              })}

            {/* Hover tooltip */}
            {hoveredId && hoveredRegion && !selectedIds.includes(hoveredId) && (() => {
              const tw = tooltipW(hoveredRegion.label);
              const tx = Math.min(Math.max(hoveredRegion.tooltipX, tw / 2 + 20), 1023 - tw / 2 - 20);
              const ty = hoveredRegion.tooltipY;
              return (
                <g pointerEvents="none">
                  <rect x={tx - tw / 2} y={ty - 96} width={tw} height={90} rx={28} fill="#1A1A2E" opacity={0.9} />
                  <text x={tx} y={ty - 36} textAnchor="middle" fill="#FFF" fontSize="46" fontFamily="Inter, sans-serif" fontWeight="600">
                    {hoveredRegion.label}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Front / Back toggle */}
        <div style={{ padding: '6px 20px 12px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', backgroundColor: '#FFF', borderRadius: 14, border: '1px solid #E5E7EB', padding: 3, gap: 2 }}>
            {(['front', 'back'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '7px 28px', borderRadius: 11, border: 'none', cursor: 'pointer',
                fontFamily: font.heading, fontWeight: 600, fontSize: 13,
                backgroundColor: view === v ? C.primary : 'transparent',
                color: view === v ? '#FFF' : C.sub,
                transition: 'all 0.15s ease',
                textTransform: 'capitalize',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected chips */}
      {count > 0 && (
        <div style={{ padding: '8px 12px 0', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: 16, padding: '10px 14px', border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: 12, color: C.text }}>Selected ({count})</span>
              <button onClick={onClearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: font.body, fontSize: 11, color: C.sub }}>Clear all</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedRegions.map(sr => (
                <div key={sr.region.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  backgroundColor: C.chipBg(sr.painLevel), border: `1px solid ${C.chipBorder(sr.painLevel)}`,
                  borderRadius: 9999, padding: '4px 9px 4px 7px',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.chipDot(sr.painLevel), flexShrink: 0 }} />
                  <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 500, color: C.text }}>{sr.region.label}</span>
                  <button onClick={() => onRemoveRegion(sr.region.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.sub, fontSize: 14, lineHeight: 1, padding: '0 0 0 1px', display: 'flex' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '10px 20px 32px', flexShrink: 0 }}>
        {count === 0
          ? <p style={{ textAlign: 'center', fontFamily: font.body, fontSize: 13, color: C.sub, margin: 0 }}>Tap any region above to begin</p>
          : <button onClick={onContinue} style={{
              width: '100%', padding: '16px 0', borderRadius: 18, border: 'none',
              backgroundColor: C.primary, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(47,128,255,0.32)',
              fontFamily: font.heading, fontWeight: 700, fontSize: 16, color: '#FFF',
            }}>
              Continue →
            </button>
        }
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF',
  border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
