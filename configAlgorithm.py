"""
Dragon Boat Crew Auto-Configuration Algorithm (Updated)

Key Changes:
- Select BEST 20 paddlers from 24 available
- Handle "both" as preferred side (flexible placement)
- Real paddler data from whiteboard
- Adaptive bench placement when preferred position isn't available

Priority order:
1. Weight balance (left vs right)
2. Preferred side (including 'both' flexibility)
3. Power ratio balance (left vs right)
4. Preferred bench position (with fallback)
"""

from typing import List, Dict, Tuple, Optional
import copy
import random


class Paddler:
    def __init__(self, name: str, weight: float, power_ratio: float, 
                 preferred_side: str, preferred_bench: str):
        """
        Args:
            name: Paddler name
            weight: Paddler weight (kg)
            power_ratio: Power output ratio (0-1 scale)
            preferred_side: 'left', 'right', or 'both'
            preferred_bench: 'stroke', 'pace', 'engine', or 'sprint'
        """
        self.name = name
        self.weight = weight
        self.power_ratio = power_ratio
        self.preferred_side = preferred_side.lower()
        self.preferred_bench = preferred_bench.lower()
    
    def __repr__(self):
        return f"{self.name} ({self.weight}kg, P:{self.power_ratio:.2f}, {self.preferred_side}, {self.preferred_bench})"


class CrewConfiguration:
    def __init__(self):
        # Only 10 benches per side (20 total paddlers)
        self.left_side = [None] * 10
        self.right_side = [None] * 10
        self.unselected_paddlers = []  # Track which 4 paddlers weren't selected
        
        # Bench categories
        self.stroke_benches = [0]  # Bench 1
        self.pace_benches = [1, 2]  # Benches 2-3
        self.engine_benches = [3, 4, 5, 6]  # Benches 4-7
        self.sprint_benches = [7, 8, 9]  # Benches 8-10
    
    def get_bench_range(self, preferred_bench: str) -> List[int]:
        """Get the bench indices for a preferred position"""
        mapping = {
            'stroke': self.stroke_benches,
            'pace': self.pace_benches,
            'engine': self.engine_benches,
            'sprint': self.sprint_benches
        }
        return mapping.get(preferred_bench, [])
    
    def get_fallback_benches(self, preferred_bench: str) -> List[List[int]]:
        """Get fallback bench options if preferred isn't available"""
        # Fallback priority order
        fallback_map = {
            'stroke': [self.pace_benches, self.engine_benches, self.sprint_benches],
            'pace': [self.stroke_benches, self.engine_benches, self.sprint_benches],
            'engine': [self.pace_benches, self.sprint_benches, self.stroke_benches],
            'sprint': [self.engine_benches, self.pace_benches, self.stroke_benches]
        }
        return fallback_map.get(preferred_bench, [])
    
    def calculate_weight_balance(self) -> float:
        """Calculate weight difference between sides (lower is better)"""
        left_weight = sum(p.weight for p in self.left_side if p)
        right_weight = sum(p.weight for p in self.right_side if p)
        return abs(left_weight - right_weight)
    
    def calculate_power_balance(self) -> float:
        """Calculate power ratio difference between sides (lower is better)"""
        left_power = sum(p.power_ratio for p in self.left_side if p)
        right_power = sum(p.power_ratio for p in self.right_side if p)
        return abs(left_power - right_power)
    
    def count_preferred_side_matches(self) -> int:
        """Count how many paddlers are on their preferred side"""
        matches = 0
        for p in self.left_side:
            if p and (p.preferred_side == 'left' or p.preferred_side == 'both'):
                matches += 1
        for p in self.right_side:
            if p and (p.preferred_side == 'right' or p.preferred_side == 'both'):
                matches += 1
        return matches
    
    def count_preferred_bench_matches(self) -> int:
        """Count how many paddlers are in their preferred bench range"""
        matches = 0
        for i, p in enumerate(self.left_side):
            if p:
                bench_range = self.get_bench_range(p.preferred_bench)
                if i in bench_range:
                    matches += 1
        for i, p in enumerate(self.right_side):
            if p:
                bench_range = self.get_bench_range(p.preferred_bench)
                if i in bench_range:
                    matches += 1
        return matches
    
    def get_total_paddlers(self) -> int:
        """Count total paddlers placed"""
        return sum(1 for p in self.left_side if p) + sum(1 for p in self.right_side if p)
    
    def calculate_score(self) -> Tuple[float, float, int, int]:
        """
        Calculate configuration score
        Returns: (weight_balance, power_balance, -side_matches, -bench_matches)
        (Lower is better for all - negative for matches so lower = more matches)
        """
        return (
            self.calculate_weight_balance(),
            self.calculate_power_balance(),
            -self.count_preferred_side_matches(),
            -self.count_preferred_bench_matches()
        )
    
    def to_dict(self) -> Dict:
        """Convert configuration to dictionary format"""
        return {
            'left_side': [
                {
                    'bench': i + 1,
                    'paddler': p.name if p else None,
                    'weight': p.weight if p else None,
                    'power': p.power_ratio if p else None,
                    'preferred_side': p.preferred_side if p else None,
                    'preferred_bench': p.preferred_bench if p else None
                } for i, p in enumerate(self.left_side)
            ],
            'right_side': [
                {
                    'bench': i + 1,
                    'paddler': p.name if p else None,
                    'weight': p.weight if p else None,
                    'power': p.power_ratio if p else None,
                    'preferred_side': p.preferred_side if p else None,
                    'preferred_bench': p.preferred_bench if p else None
                } for i, p in enumerate(self.right_side)
            ],
            'unselected_paddlers': [
                {
                    'name': p.name,
                    'weight': p.weight,
                    'power': p.power_ratio,
                    'preferred_side': p.preferred_side,
                    'preferred_bench': p.preferred_bench
                } for p in self.unselected_paddlers
            ],
            'stats': {
                'left_total_weight': sum(p.weight for p in self.left_side if p),
                'right_total_weight': sum(p.weight for p in self.right_side if p),
                'weight_difference': self.calculate_weight_balance(),
                'left_total_power': sum(p.power_ratio for p in self.left_side if p),
                'right_total_power': sum(p.power_ratio for p in self.right_side if p),
                'power_difference': self.calculate_power_balance(),
                'preferred_side_matches': self.count_preferred_side_matches(),
                'preferred_bench_matches': self.count_preferred_bench_matches(),
                'total_paddlers': self.get_total_paddlers()
            }
        }


def auto_configure_crew(paddlers: List[Paddler]) -> CrewConfiguration:
    """
    Configure dragon boat crew - select best 20 from 24 paddlers
    
    Strategy:
    1. Sort by weight for better balance control
    2. Try to place each paddler optimally
    3. Select top 20 that give best overall configuration
    4. Handle 'both' side preference with full flexibility
    5. Allow fallback to other bench positions if preferred is full
    """
    config = CrewConfiguration()
    
    # Sort paddlers by weight (descending)
    sorted_paddlers = sorted(paddlers, key=lambda p: p.weight, reverse=True)
    
    placed_paddlers = []
    
    for paddler in sorted_paddlers:
        # Don't place more than 20 paddlers
        if config.get_total_paddlers() >= 20:
            config.unselected_paddlers.append(paddler)
            continue
        
        best_placement = None
        best_score = None
        
        # Get preferred bench positions
        preferred_benches = config.get_bench_range(paddler.preferred_bench)
        fallback_benches_list = config.get_fallback_benches(paddler.preferred_bench)
        
        # Build bench priority list: preferred first, then fallbacks
        bench_priority = [preferred_benches] + fallback_benches_list
        all_benches_to_try = []
        for bench_group in bench_priority:
            all_benches_to_try.extend(bench_group)
        # Also add any remaining benches
        for i in range(10):
            if i not in all_benches_to_try:
                all_benches_to_try.append(i)
        
        # Determine side priority based on preference
        if paddler.preferred_side == 'left':
            sides_order = ['left', 'right']
        elif paddler.preferred_side == 'right':
            sides_order = ['right', 'left']
        else:  # 'both'
            # For 'both', try the side that currently has less weight
            left_weight = sum(p.weight for p in config.left_side if p)
            right_weight = sum(p.weight for p in config.right_side if p)
            sides_order = ['left', 'right'] if left_weight <= right_weight else ['right', 'left']
        
        # Try all bench positions with side priority
        for bench_idx in all_benches_to_try:
            for side in sides_order:
                # Check if position is available
                side_array = config.left_side if side == 'left' else config.right_side
                
                if side_array[bench_idx] is not None:
                    continue
                
                # Temporarily place paddler
                side_array[bench_idx] = paddler
                
                # Calculate score
                score = config.calculate_score()
                
                # Check if this is the best placement
                if best_score is None or score < best_score:
                    best_score = score
                    best_placement = (side, bench_idx)
                
                # Remove paddler for next iteration
                side_array[bench_idx] = None
        
        # Place paddler in best position found
        if best_placement:
            side, bench_idx = best_placement
            side_array = config.left_side if side == 'left' else config.right_side
            side_array[bench_idx] = paddler
            placed_paddlers.append(paddler)
        else:
            # No valid placement found
            config.unselected_paddlers.append(paddler)
    
    return config


def auto_configure_crew_optimized(paddlers: List[Paddler], iterations: int = 50) -> CrewConfiguration:
    """
    Enhanced version - tries multiple orderings to find best configuration
    """
    best_config = None
    best_score = None
    
    for i in range(iterations):
        # Different sorting strategies
        if i == 0:
            # Weight-based
            test_paddlers = sorted(paddlers, key=lambda p: p.weight, reverse=True)
        elif i == 1:
            # Power-based
            test_paddlers = sorted(paddlers, key=lambda p: p.power_ratio, reverse=True)
        elif i == 2:
            # Balanced weight and power
            test_paddlers = sorted(paddlers, key=lambda p: (p.weight + p.power_ratio * 50), reverse=True)
        else:
            # Random shuffle
            test_paddlers = paddlers.copy()
            random.shuffle(test_paddlers)
        
        config = auto_configure_crew(test_paddlers)
        score = config.calculate_score()
        
        if best_score is None or score < best_score:
            best_score = score
            best_config = config
    
    return best_config


# Real paddler data from whiteboard
REAL_PADDLERS = [
    # Left side paddlers (from whiteboard)
    Paddler("LILY", 67, 0.588, "left", "stroke"),
    Paddler("JADE", 66, 0.529, "both", "stroke"),
    Paddler("JOE", 83, 0.588, "right", "stroke"),    
    Paddler("ELI", 72, 1.000, "both", "engine"),
    Paddler("ETHAN", 69, 0.647, "both", "stroke"),
    Paddler("JOSHUA", 60, 0.588, "right", "pace"),
    Paddler("EVA", 62, 0.412, "both", "pace"),
    Paddler("NICK", 105, 1.000, "left", "engine"),
    Paddler("ANNABELLE", 63, 0.529, "left", "engine"),
    Paddler("TSUYOSHI", 60, 0.588, "left", "pace"),
    Paddler("PHOEBE", 60, 0.412, "left", "sprint"),
    Paddler("RIO", 61, 0.471, "both", "sprint"),
    Paddler("EVANTHI", 72, 0.471, "right", "engine"),
    Paddler("ISLA", 61, 0.412, "both", "sprint"),

    Paddler("HANA", 65, 0.471, "right", "pace"),
    Paddler("HUNTER", 91, 0.941, "both", "engine"),
    Paddler("MADDY", 56, 0.529, "right", "engine"),
    Paddler("JAKEY", 59, 0.588, "right", "engine"),
    Paddler("CLAIRE", 53, 0.412, "both", "sprint"),
    Paddler("NYLA", 64, 0.412, "right", "stroke")
]


if __name__ == "__main__":
    print("=" * 80)
    print("DRAGON BOAT CREW AUTO-CONFIGURATION")
    print("=" * 80)
    print(f"\nTotal paddlers available: {len(REAL_PADDLERS)}")
    print("Selecting best 20 paddlers for optimal configuration...\n")
    
    # Run optimized configuration
    config = auto_configure_crew_optimized(REAL_PADDLERS, iterations=100)
    result = config.to_dict()
    
    print("=" * 80)
    print("LEFT SIDE")
    print("=" * 80)
    for seat in result['left_side']:
        if seat['paddler']:
            side_pref = "✓" if seat['preferred_side'] in ['left', 'both'] else "✗"
            bench_pref = "✓" if seat['bench'] in [
                b + 1 for b in config.get_bench_range(seat['preferred_bench'])
            ] else "✗"
            print(f"Bench {seat['bench']:2d}: {seat['paddler']:12s} | "
                  f"Weight: {seat['weight']:4.0f}kg | Power: {seat['power']:.2f} | "
                  f"Side: {side_pref} | Bench: {bench_pref} | "
                  f"Pref: {seat['preferred_side']:5s}/{seat['preferred_bench']}")
    
    print("\n" + "=" * 80)
    print("RIGHT SIDE")
    print("=" * 80)
    for seat in result['right_side']:
        if seat['paddler']:
            side_pref = "✓" if seat['preferred_side'] in ['right', 'both'] else "✗"
            bench_pref = "✓" if seat['bench'] in [
                b + 1 for b in config.get_bench_range(seat['preferred_bench'])
            ] else "✗"
            print(f"Bench {seat['bench']:2d}: {seat['paddler']:12s} | "
                  f"Weight: {seat['weight']:4.0f}kg | Power: {seat['power']:.2f} | "
                  f"Side: {side_pref} | Bench: {bench_pref} | "
                  f"Pref: {seat['preferred_side']:5s}/{seat['preferred_bench']}")
    
    print("\n" + "=" * 80)
    print("UNSELECTED PADDLERS (4 reserves)")
    print("=" * 80)
    for paddler in result['unselected_paddlers']:
        print(f"{paddler['name']:12s} | Weight: {paddler['weight']:4.0f}kg | "
              f"Power: {paddler['power']:.2f} | "
              f"Pref: {paddler['preferred_side']:5s}/{paddler['preferred_bench']}")
    
    print("\n" + "=" * 80)
    print("STATISTICS")
    print("=" * 80)
    stats = result['stats']
    print(f"Total paddlers in boat: {stats['total_paddlers']}/20")
    print(f"\nWEIGHT BALANCE:")
    print(f"  Left side:  {stats['left_total_weight']:6.1f} kg")
    print(f"  Right side: {stats['right_total_weight']:6.1f} kg")
    print(f"  Difference: {stats['weight_difference']:6.1f} kg")
    print(f"\nPOWER BALANCE:")
    print(f"  Left side:  {stats['left_total_power']:6.2f}")
    print(f"  Right side: {stats['right_total_power']:6.2f}")
    print(f"  Difference: {stats['power_difference']:6.2f}")
    print(f"\nPREFERENCE MATCHES:")
    print(f"  Preferred side:  {stats['preferred_side_matches']}/20 "
          f"({stats['preferred_side_matches']/20*100:.1f}%)")
    print(f"  Preferred bench: {stats['preferred_bench_matches']}/20 "
          f"({stats['preferred_bench_matches']/20*100:.1f}%)")
    print("=" * 80)