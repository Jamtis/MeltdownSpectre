export const page_size = 5000;
export const min_iterations = 3;
export const max_cache_hit_number = 3;
export const repetitions = 500;
export const probe_length = 1 << 8;
export const speculative_repetitions = 1 << 8;
export default {
    probe_length,
    page_size,
    repetitions,
    min_iterations,
    max_cache_hit_number,
    speculative_repetitions
};